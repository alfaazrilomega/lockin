"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";

interface AccordionItem {
  id: string;
  number: string;
  title: string;
  description: string;
  partners: Array<{ name: string; tag: string }>;
}

const ACCORDION_DATA: AccordionItem[] = [
  {
    id: "sync",
    number: "01",
    title: "Real-Time Synchronization",
    description: "Experience zero-latency updates across all devices. We've partnered with edge-computing networks to ensure your task states, doc cursors, and kanban cards sync within 50 milliseconds globally.",
    partners: [
      { name: "Global Edge", tag: "Infrastructure" },
      { name: "LiveBlocks", tag: "Collab Engine" },
    ]
  },
  {
    id: "ai",
    number: "02",
    title: "AI Knowledge Base",
    description: "Your second brain is natively powered by the best large language models. Semantic search instantly reads through thousands of your notes, instantly pulling up correct context without matching exact keywords.",
    partners: [
      { name: "Anthropic", tag: "LLM Partner" },
      { name: "Pinecone", tag: "Vector Index" },
    ]
  },
  {
    id: "graph",
    number: "03",
    title: "Global Resource Graph",
    description: "Every file, task, and team member in LockIn exists on a unified relational graph. Tagging an issue creates a bidirectional bridge instantly.",
    partners: [
      { name: "Neo4j", tag: "Graph Tech" },
    ]
  },
  {
    id: "canvas",
    number: "04",
    title: "Infinite Canvas Flow",
    description: "Break out of strict grids. Pin tasks, draw relationships, and organize your sprint freeform before snapping it back into a strict Kanban view.",
    partners: [
      { name: "Tldraw", tag: "Canvas Engine" },
    ]
  },
  {
    id: "vault",
    number: "05",
    title: "Secure Document Vault",
    description: "Enterprise-grade encryption for all uploaded assets. Your documents are sharded and stored globally with perfect forward secrecy.",
    partners: [
      { name: "AWS Key Management", tag: "Security" },
    ]
  },
];

export default function FeatureAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.1) {
        setIsVisible(true);
      } else if (entry.intersectionRatio === 0) {
        setIsVisible(false);
      }
    }, { threshold: [0, 0.1] });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#f7f7f7] py-24 md:py-32" ref={sectionRef}>
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Title Section */}
        <div className="flex flex-col mb-16 md:mb-24">
          <span className={`font-['Aeonik',sans-serif] text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] transition-colors duration-1000 ease-in-out ${isVisible ? "text-[#b3b3b3]" : "text-[#151717]/5"}`}>
            Our
          </span>
          <h2 className={`font-['Aeonik',sans-serif] text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[1] tracking-[-0.04em] -mt-1 md:-mt-3 transition-colors duration-1000 delay-150 ease-in-out ${isVisible ? "text-[#151717]" : "text-[#151717]/5"}`}>
            Featured
          </h2>
        </div>

        <div className="w-full border-t border-black/10">
        {ACCORDION_DATA.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div 
              key={item.id}
              className="group border-b border-black/10 flex flex-col"
            >
              {/* Header (Clickable) */}
              <button 
                onClick={() => toggleItem(item.id)}
                className="w-full py-8 md:py-10 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="font-['Aeonik',sans-serif] text-sm md:text-base font-medium text-black/30">
                    {item.number}
                  </span>
                  <h3 className={`font-['Aeonik',sans-serif] text-2xl md:text-4xl tracking-tight transition-colors duration-300 ${isOpen ? "text-black" : "text-black hover:text-black/60"}`}>
                    {item.title}
                  </h3>
                </div>
                
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center shrink-0 ml-4 group-hover:border-black/30 transition-colors">
                  {isOpen ? (
                    <X className="w-4 h-4 text-black transition-transform duration-500 rotate-90" />
                  ) : (
                    <Plus className="w-4 h-4 text-black transition-transform duration-500" />
                  )}
                </div>
              </button>

              {/* Content Panel (Grid transition for smooth height animation) */}
              <div 
                className={`grid transition-[grid-template-rows,opacity] duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-10 pl-14 md:pl-20 pr-4 md:pr-12 w-full max-w-4xl flex flex-col gap-10">
                    <p className="text-base md:text-lg text-[#1c1629]/70 leading-relaxed font-medium">
                      {item.description}
                    </p>
                    
                    {/* Partner Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {item.partners.map((partner, idx) => (
                        <div 
                          key={idx}
                          className="bg-black/[0.02] hover:bg-black/[0.04] transition-colors rounded-2xl p-6 border border-black/5 flex flex-col gap-8 cursor-pointer"
                        >
                           <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center font-bold text-xl text-black">
                              {partner.name.charAt(0)}
                           </div>
                           <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1">
                                {partner.tag}
                              </div>
                              <div className="text-lg font-medium text-black">
                                {partner.name}
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
