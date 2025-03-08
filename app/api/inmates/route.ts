import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

// Cache to avoid excessive scraping and improve performance
const CACHE: Record<string, any> = {}
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const inmateNumber = searchParams.get("inmateNumber")
    const inmateNameParam = searchParams.get("name")
    const jurisdiction = searchParams.get("jurisdiction") || "nm"

    if (!inmateNumber && !inmateNameParam) {
      return NextResponse.json({ error: "Inmate number or name is required" }, { status: 400 })
    }

    // Only allow New Mexico searches
    if (jurisdiction !== "nm" && jurisdiction !== "all") {
      return NextResponse.json({ error: "Only New Mexico searches are supported" }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `nm-${inmateNumber || inmateNameParam}`
    if (CACHE[cacheKey] && CACHE[cacheKey].timestamp > Date.now() - CACHE_DURATION) {
      return NextResponse.json(CACHE[cacheKey].data)
    }

    try {
      // Search for inmate in New Mexico system
      const inmateData = await searchNewMexicoInmate(inmateNumber, inmateNameParam)

      if (inmateData) {
        cacheResult(cacheKey, inmateData)
        return NextResponse.json(inmateData)
      } else {
        return NextResponse.json({ error: "Inmate not found" }, { status: 404 })
      }
    } catch (error) {
      console.error("Error in search:", error)
      return NextResponse.json({ error: "Search failed", details: (error as Error).message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 })
  }
}

function cacheResult(key: string, data: any) {
  CACHE[key] = {
    data,
    timestamp: Date.now(),
  }
}

/**
 * Searches for a New Mexico inmate using the NMCD website
 * Handles CAPTCHA verification and extracts detailed inmate info
 */
async function searchNewMexicoInmate(inmateNumber?: string | null, inmateName?: string | null) {
  try {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

    try {
      const page = await browser.newPage()

      // Navigate to NM Corrections search page
      await page.goto("https://cd.nm.gov/offender-search/")

      // Check "Include Inactive"
      await page.click("#include-inactive")

      if (inmateNumber) {
        await page.type("#offender-number", inmateNumber)
      } else if (inmateName) {
        // Split name into first and last
        const [lastName, firstName] = inmateName.split(" ")
        if (lastName) await page.type("#last-name", lastName)
        if (firstName) await page.type("#first-name", firstName)
      }

      // Handle CAPTCHA
      // Wait for CAPTCHA to be solved (in production, would use a CAPTCHA solving service)
      await page.waitForSelector("#g-recaptcha-response", { timeout: 30000 })

      // Click search
      await page.click("button[type='submit']")

      // Wait for results
      await page.waitForSelector("table.results")

      // Check if we have any results
      const results = await page.$$("tr.result-row")
      if (results.length === 0) {
        throw new Error("No inmates found")
      }

      // Click "View Details" on first matching result
      await page.click("a.view-details")

      // Wait for details page
      await page.waitForSelector(".inmate-details")

      // Extract inmate information
      const inmateData = await page.evaluate(() => {
        return {
          inmateNumber: document.querySelector("#nmcd-number")?.textContent,
          name: document.querySelector("#inmate-name")?.textContent,
          age: Number.parseInt(document.querySelector("#age")?.textContent || "0"),
          race: document.querySelector("#race")?.textContent,
          sex: document.querySelector("#gender")?.textContent,
          location: document.querySelector("#facility")?.textContent,
          status: document.querySelector("#status")?.textContent,
          height: document.querySelector("#height")?.textContent,
          weight: document.querySelector("#weight")?.textContent,
          hair: document.querySelector("#hair")?.textContent,
          eyes: document.querySelector("#eyes")?.textContent,
        }
      })

      // Search NM Courts for cases using inmate info
      const courtCases = await searchNMCourts(inmateData)

      // Combine inmate data with court cases
      return {
        ...inmateData,
        courtDates: courtCases,
      }
    } catch (error) {
      console.error("Error in NM inmate search:", error)
      throw error
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error("Error in NM inmate search:", error)
    throw error
  }
}

/**
 * Searches the NM Courts website for cases matching inmate info
 */
async function searchNMCourts(inmateData: any) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    try {
      const page = await browser.newPage()

      // Navigate to NM Courts search
      await page.goto("https://caselookup.nmcourts.gov/")

      // Search using inmate name
      if (inmateData.name) {
        const nameParts = inmateData.name.split(", ")
        if (nameParts.length > 1) {
          const lastName = nameParts[0]
          const firstName = nameParts[1].split(" ")[0]

          // Fill out search form
          await page.type("#lastName", lastName)
          await page.type("#firstName", firstName)

          // Submit search
          await page.click("input[type='submit']")

          // Wait for results
          await page.waitForSelector("table.caseTable", { timeout: 10000 })

          // Extract court dates
          return await page.evaluate(() => {
            const courtDates = []
            const rows = document.querySelectorAll("table.caseTable tr")

            for (let i = 1; i < rows.length; i++) {
              // Skip header row
              const cells = rows[i].querySelectorAll("td")
              if (cells.length >= 5) {
                const caseInfo = cells[0].textContent?.trim()
                const hearingInfo = cells[3].textContent?.trim()
                const locationInfo = cells[4].textContent?.trim()

                if (hearingInfo && hearingInfo.includes("/")) {
                  // Parse date and time
                  const dateParts = hearingInfo.split(" ")
                  const dateStr = dateParts[0]
                  const timeStr = dateParts[1] + " " + dateParts[2]

                  // Convert MM/DD/YYYY to YYYY-MM-DD
                  const [month, day, year] = dateStr.split("/")
                  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

                  courtDates.push({
                    date: formattedDate,
                    time: timeStr,
                    type: caseInfo || "Court Hearing",
                    location: locationInfo || "New Mexico Court",
                    judge: "Not specified",
                    source: "NM Courts Case Lookup",
                  })
                }
              }
            }

            return courtDates
          })
        }
      }

      return [] // Return empty array if no name or no results
    } catch (error) {
      console.error("Error searching NM Courts:", error)
      return [] // Return empty array on error
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error("Error searching NM Courts:", error)
    return [] // Return empty array on error
  }
}

