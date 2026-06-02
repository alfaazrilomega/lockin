import React from 'react'

export const SEQUENCE = [
  { type: "text", content: "Unforgettable memories are not defined by details." },
  { type: "image", url: "https://images.unsplash.com/photo-1522093086933-245f7823f0ce?auto=format&fit=crop&q=80&w=1600" },
  { type: "text", content: "They are felt." },
  { type: "image", url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=1600" },
  { type: "text", content: "Design translates emotion into form." },
  { type: "image", url: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?auto=format&fit=crop&q=80&w=1600" },
  { type: "text", content: "Form that evokes." },
]

export default function ChronologicalSequence() {
  return (
    <>
      {SEQUENCE.map((item, index) => {
        if (item.type === "text") {
          return (
            <div key={index} className="seq-item type-text absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4 opacity-0" style={{ clipPath: "inset(0 0 0 0)" }}>
              <div className="relative inline-block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-center max-w-4xl">
                {/* Base Dark Grey Layer */}
                <div className="text-[#333333]">{item.content}</div>
                {/* Pure White Highlight Layer (Wipes in) */}
                <div className="seq-text-highlight absolute left-0 top-0 text-[#f4f4f4] w-full h-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
                  {item.content}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div key={index} className="seq-item type-image absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-8 opacity-0">
              <div className="seq-image-container relative w-full h-full max-w-3xl max-h-[70vh] overflow-hidden" style={{ clipPath: "inset(100% 0 0 0)" }}>
                <img src={item.url} alt="Sequence Context" className="w-full h-full object-cover" />
              </div>
            </div>
          )
        }
      })}
    </>
  )
}
