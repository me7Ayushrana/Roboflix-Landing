"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Cpu, Sparkles, HelpCircle, Package, Search } from "lucide-react"
import { ExperimentConfig, LAB_COMPONENTS } from "@/lib/lab/experimentConfigs"

interface ComponentPaletteProps {
  config: ExperimentConfig
  onDragStart: (e: React.DragEvent, componentId: string) => void
}

export default function ComponentPalette({ config, onDragStart }: ComponentPaletteProps) {
  const [activeSubTab, setActiveSubTab] = useState<"brief" | "components" | "objects">("components")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "microcontroller" | "sensor" | "tool" | "object">("all")

  const requiredComponents = Object.values(LAB_COMPONENTS).filter(c => 
    config.components.includes(c.id) && 
    !c.id.startsWith("obj-") &&
    (selectedCategory === "all" || c.category === selectedCategory)
  )

  const additionalComponents = Object.values(LAB_COMPONENTS).filter(c => 
    !config.components.includes(c.id) && 
    !c.id.startsWith("obj-") &&
    (selectedCategory === "all" || c.category === selectedCategory)
  )

  const testingObjects = Object.values(LAB_COMPONENTS).filter(c =>
    c.id.startsWith("obj-")
  )

  const filteredRequired = requiredComponents.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAdditional = additionalComponents.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredObjects = testingObjects.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-[280px] bg-[#0c0c0c] border-r border-gray-800 flex flex-col h-full flex-shrink-0 text-white relative">
      {/* CSS Scrollbar rules styling injection */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(220, 38, 38, 0.4) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.7);
        }
        .scrollbar-none {
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Panel Selector Header */}
      <div className="grid grid-cols-3 border-b border-gray-800 text-[10px] uppercase font-semibold tracking-wider text-center">
        <button
          onClick={() => setActiveSubTab("brief")}
          className={`py-3 flex items-center justify-center gap-1 transition-all ${
            activeSubTab === "brief"
              ? "text-red-500 border-b-2 border-red-650 bg-red-950/5"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <BookOpen className="w-3 h-3" />
          Brief
        </button>
        <button
          onClick={() => setActiveSubTab("components")}
          className={`py-3 flex items-center justify-center gap-1 transition-all ${
            activeSubTab === "components"
              ? "text-red-500 border-b-2 border-red-650 bg-red-950/5"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Cpu className="w-3 h-3" />
          Parts
        </button>
        <button
          onClick={() => setActiveSubTab("objects")}
          className={`py-3 flex items-center justify-center gap-1 transition-all ${
            activeSubTab === "objects"
              ? "text-red-500 border-b-2 border-red-650 bg-red-950/5"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Package className="w-3 h-3" />
          Objects
        </button>
      </div>

      {/* Panel Scroll Area */}
      <div className="h-0 flex-grow overflow-y-auto p-4 custom-scrollbar" data-lenis-prevent>
        {activeSubTab === "brief" ? (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">
                LMS Virtual Lab
              </p>
              <h2 className="text-base font-bold leading-tight text-white">
                {config.title}
              </h2>
            </div>

            {/* Objective Card */}
            <div className="p-3.5 bg-gray-900/60 border border-gray-800/80 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                Lesson Objective
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {config.objective}
              </p>
            </div>

            {/* Hints Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                Quick Steps
              </div>
              <ul className="space-y-2.5 text-[11px] text-gray-400 font-sans list-disc list-inside leading-relaxed">
                <li>Drag the required parts from the <b>Parts</b> tab onto the central wire grid.</li>
                <li>Hover over hardware connection pins to highlight and draw connections.</li>
                <li>Connect signal lines to the correct designated Arduino pins.</li>
                <li>Ensure power (<b>5V/3V3</b>) and ground (<b>GND</b>) lanes are completely wired.</li>
                <li>Click <b>Run Simulation</b> to test compilation and validation keywords!</li>
              </ul>
            </div>
          </div>
        ) : activeSubTab === "components" ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-red-500" />
                Hardware Bin
              </h3>
              <p className="text-[10px] text-gray-500">
                Drag sensors & controllers onto wire grid.
              </p>
            </div>

            {/* Component Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search hardware parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5" />
            </div>

            {/* Category Filter Options */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" data-lenis-prevent>
              {[
                { id: "all", label: "All" },
                { id: "microcontroller", label: "Controllers" },
                { id: "sensor", label: "Sensors" },
                { id: "tool", label: "Tools" },
                { id: "object", label: "Objects" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-red-950/40 text-red-400 border-red-500/50 shadow-[0_0_8px_rgba(220,38,38,0.15)] font-extrabold"
                      : "bg-[#111] text-gray-400 border-gray-800 hover:text-gray-300 hover:border-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>


            {/* Required Components Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse" />
                Required Components
              </div>
              <div className="grid grid-cols-1 gap-2">
                {filteredRequired.length > 0 ? (
                  filteredRequired.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      className="p-3 bg-gray-900 border border-red-950 hover:border-red-600/40 rounded-xl transition-all cursor-grab active:cursor-grabbing flex items-center gap-3.5 group hover:bg-red-950/5 relative overflow-hidden text-left"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600" />
                      <div className="w-9 h-9 bg-red-650/10 border border-red-500/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          item.icon
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_5px_#dc2626] flex-shrink-0" />
                          <p className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors whitespace-normal break-words leading-tight">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {item.pins.length} Pins
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-gray-600 text-xs italic">
                    No components found.
                  </div>
                )}
              </div>
            </div>

            {/* Additional Components Section */}
            <div className="space-y-2 pt-3 border-t border-gray-800/80">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                Additional Hardware Spares
              </div>
              <div className="grid grid-cols-1 gap-2">
                {filteredAdditional.length > 0 ? (
                  filteredAdditional.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      className="p-3 bg-gray-950/60 border border-gray-900 hover:border-gray-800 rounded-xl transition-all cursor-grab active:cursor-grabbing flex items-center gap-3 group hover:bg-white/5 relative overflow-hidden opacity-75 hover:opacity-100 text-left"
                    >
                      <div className="w-9 h-9 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          item.icon
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {item.pins.length} Pins
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-gray-600 text-xs italic">
                    No spares found.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* OBJECTS TAB PANEL */
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-red-500" />
                Testing Assets
              </h3>
              <p className="text-[10px] text-gray-500">
                Drag objects onto canvas to test sensor triggers.
              </p>
            </div>

            {/* Object Search Input */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search testing objects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5" />
            </div>

            {/* Objects List */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {filteredObjects.length > 0 ? (
                  filteredObjects.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      className="p-3 bg-gray-950/65 border border-gray-900 hover:border-gray-800 rounded-xl transition-all cursor-grab active:cursor-grabbing flex items-center gap-3.5 group hover:bg-white/5 relative overflow-hidden text-left"
                    >
                      <div className="w-9 h-9 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors overflow-hidden">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-gray-400 transition-colors flex-shrink-0" />
                          <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors whitespace-normal break-words leading-tight">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          Testing Object
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-gray-600 text-xs italic">
                    No objects found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
