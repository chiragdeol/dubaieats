/**
 * Utility to calculate whether a restaurant is open right now in Dubai timezone (Asia/Dubai - GST UTC+4)
 */

export function isCurrentlyOpenInDubai(hoursString: string): { isOpen: boolean; label: string } {
  if (!hoursString || hoursString.toLowerCase() === "closed") {
    return { isOpen: false, label: "Closed" };
  }

  if (hoursString.includes("24 Hours") || hoursString.includes("24 hours")) {
    return { isOpen: true, label: "Open 24 Hours" };
  }

  try {
    // Get current time in Dubai (UTC+4)
    const now = new Date();
    const dubaiDateStr = now.toLocaleString("en-US", { timeZone: "Asia/Dubai" });
    const dubaiDate = new Date(dubaiDateStr);
    const currentMinutes = dubaiDate.getHours() * 60 + dubaiDate.getMinutes();

    // Parse standard hours like "6:00 PM – 11:30 PM" or "12:00 PM – 3:30 PM, 7:00 PM – 12:00 AM"
    const shifts = hoursString.split(",").map(s => s.trim());
    let isOpenNow = false;

    for (const shift of shifts) {
      const match = shift.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*[\u2013\u2014-]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
      if (match) {
        let startH = parseInt(match[1], 10);
        const startM = match[2] ? parseInt(match[2], 10) : 0;
        const startAmpm = match[3].toUpperCase();

        let endH = parseInt(match[4], 10);
        const endM = match[5] ? parseInt(match[5], 10) : 0;
        const endAmpm = match[6].toUpperCase();

        if (startAmpm === "PM" && startH < 12) startH += 12;
        if (startAmpm === "AM" && startH === 12) startH = 0;

        if (endAmpm === "PM" && endH < 12) endH += 12;
        if (endAmpm === "AM" && endH === 12) endH = 0;

        let startTotal = startH * 60 + startM;
        let endTotal = endH * 60 + endM;

        // If end time is past midnight (e.g. 7:00 PM – 1:00 AM)
        if (endTotal <= startTotal) {
          endTotal += 24 * 60;
          if (currentMinutes < startTotal && currentMinutes < endTotal - 24 * 60) {
            // Early morning hours before closing
            if (currentMinutes + 24 * 60 <= endTotal) {
              isOpenNow = true;
              break;
            }
          }
        }

        if (currentMinutes >= startTotal && currentMinutes <= endTotal) {
          isOpenNow = true;
          break;
        }
      }
    }

    return {
      isOpen: isOpenNow,
      label: isOpenNow ? "Open" : "Closed",
    };
  } catch (e) {
    // Fallback if parsing fails
    return { isOpen: true, label: "Open" };
  }
}
