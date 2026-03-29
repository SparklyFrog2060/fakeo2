
"use client"

import React from "react"
import Image from "next/image"
import o2Logo from "@/components/ui/o2.svg"

export function O2Icon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image 
        src={o2Logo} 
        alt="o2" 
        width={32} 
        height={16} 
        className="object-contain"
        priority
      />
    </div>
  )
}
