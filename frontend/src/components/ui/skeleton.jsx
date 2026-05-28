import React from "react"

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md ${className}`}
    />
  )
}

export { Skeleton }
