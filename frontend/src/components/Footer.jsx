

import { useState, useEffect } from 'react'

function Footer() {
  // currentDate — holds today's formatted date string e.g. "Saturday, May 10, 2026"
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // updateDate — reads the current date and formats it into a readable string
    function updateDate() {
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions))
    }

    updateDate() // run immediately on first render so date shows right away

    // Run every 60 seconds to keep the date accurate if app stays open past midnight
    const timer = setInterval(updateDate, 60000)

    // Cleanup: stop the interval when Footer unmounts to prevent memory leaks
    return () => clearInterval(timer)
  }, [])

  return (
    <footer className="border-t border-purple-800/30 bg-purple-950/60 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">

        <div className="flex items-center gap-2 text-sm text-purple-300/70">
          <span>📒</span>
          <span className="font-medium text-purple-200/80">Notes Manager</span>
          <span className="text-purple-500/50">•</span>
          {/* new Date().getFullYear() always returns the current year automatically */}
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        {/* Right side — current date, updates every 60 seconds via setInterval */}
        <div className="text-xs text-purple-400/50 flex items-center gap-1.5">
          <span>📅</span>
          <span>{currentDate}</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer
