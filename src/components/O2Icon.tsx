"use client"

import React from "react"
import Image from "next/image"

export function O2Icon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image 
        src="/o2.svg" 
        alt="Logo o2" 
        width={64} 
        height={32} 
        className="object-contain"
        priority
      />
    </div>
  )
}
