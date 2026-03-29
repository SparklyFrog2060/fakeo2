"use client"

import React from "react"

export function O2Icon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M20.5 35C11.94 35 5 28.28 5 20C5 11.72 11.94 5 20.5 5C29.06 5 36 11.72 36 20C36 28.28 29.06 35 20.5 35ZM20.5 10.5C15.25 10.5 11 14.75 11 20C11 25.25 15.25 29.5 20.5 29.5C25.75 29.5 30 25.25 30 20C30 14.75 25.75 10.5 20.5 10.5Z" 
        fill="#002aff"
      />
      <path 
        d="M60.5 35.5H45V30.5L53.5 21.5C54.5 20.5 55 19.5 55 18.5C55 17.5 54.5 16.5 53.5 16.5C52.5 16.5 51.5 17.5 51.5 18.5H46C46 14.5 49 11.5 53.5 11.5C58 11.5 61 14.5 61 18.5C61 21.5 59.5 23.5 57 26L52 30.5H60.5V35.5Z" 
        fill="#002aff"
      />
      <circle cx="75" cy="12" r="6" fill="#002aff" />
    </svg>
  )
}
