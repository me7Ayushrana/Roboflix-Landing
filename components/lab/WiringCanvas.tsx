"use client"

import { useState, useRef, useEffect } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Trash2, Sliders, Cpu, Play, Pause, Undo } from "lucide-react"
import { LAB_COMPONENTS } from "@/lib/lab/experimentConfigs"
import { PlacedComponent, WireConnection } from "@/lib/lab/simulationEngine"

interface WiringCanvasProps {
  placedComponents: PlacedComponent[]
  connections: WireConnection[]
  onUpdateComponents: (comps: PlacedComponent[]) => void
  onUpdateConnections: (conns: WireConnection[]) => void
  isSimulating?: boolean
  onRun?: () => void
  onUpload?: () => void
  onClear?: () => void
  passed?: boolean | null
  isNightMode?: boolean
  /** LED is actively glowing (driven by sensor distance) */
  ledActive?: boolean
  /** Buzzer is actively beeping (driven by sensor distance) */
  buzzerActive?: boolean
}

const getWireHexColor = (colorName: string) => {
  switch (colorName) {
    case "red": return "#ef4444"
    case "black": return "#1f2937"
    case "yellow": return "#eab308"
    case "green": return "#22c55e"
    case "blue": return "#3b82f6"
    case "purple": return "#a855f7"
    case "orange": return "#f97316"
    case "cyan": return "#06b6d4"
    default: return "#ef4444"
  }
}

export default function WiringCanvas({
  placedComponents,
  connections,
  onUpdateComponents,
  onUpdateConnections,
  isSimulating,
  onRun,
  onUpload,
  onClear,
  passed,
  isNightMode = true,
  ledActive = false,
  buzzerActive = false
}: WiringCanvasProps) {
  const [zoom, setZoom] = useState(1.0)
  const [activeWireColor, setActiveWireColor] = useState<string>("red")
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null)
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null)
  
  // Drawing Wire State
  const [wireStart, setWireStart] = useState<{ compId: string; pinId: string; x: number; y: number } | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Undo history stack for wire connections
  const [connectionsHistory, setConnectionsHistory] = useState<WireConnection[][]>([])

  // Rotate component when pressing 'R'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && selectedCompId) {
        // Skip if user is typing in code editor or fields
        if (
          document.activeElement?.tagName === "INPUT" || 
          document.activeElement?.tagName === "TEXTAREA" ||
          document.activeElement?.classList.contains("monaco-editor") ||
          document.activeElement?.getAttribute("contenteditable") === "true"
        ) {
          return
        }
        e.preventDefault()
        const updated = placedComponents.map(c => {
          if (c.id === selectedCompId) {
            return {
              ...c,
              rotation: ((c.rotation || 0) + 90) % 360
            }
          }
          return c
        })
        onUpdateComponents(updated)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCompId, placedComponents, onUpdateComponents])

  // Mouse scroll wheel & trackpad pinch-to-zoom event listener
  useEffect(() => {
    const canvasDiv = canvasRef.current
    if (!canvasDiv) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.05 : -0.05
      setZoom(prev => Math.min(1.5, Math.max(0.6, prev + delta)))
    }

    canvasDiv.addEventListener("wheel", handleWheel, { passive: false })
    return () => canvasDiv.removeEventListener("wheel", handleWheel)
  }, [])

  const handleUndo = () => {
    if (connectionsHistory.length === 0) return
    const prev = connectionsHistory[connectionsHistory.length - 1]
    setConnectionsHistory(hist => hist.slice(0, -1))
    onUpdateConnections(prev)
  }

  // Snaps coordinate to a 10px grid
  const snapToGrid = (val: number): number => {
    return Math.round(val / 10) * 10
  }

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle Drop from Component Palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return

    const componentId = e.dataTransfer.getData("text/plain")
    if (!componentId || !LAB_COMPONENTS[componentId]) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = snapToGrid((e.clientX - rect.left - 50) / zoom)
    const y = snapToGrid((e.clientY - rect.top - 40) / zoom)

    const newComp: PlacedComponent = {
      id: `${componentId}_${Date.now()}`,
      componentId,
      x: Math.max(10, x),
      y: Math.max(10, y)
    }

    onUpdateComponents([...placedComponents, newComp])
  }

  // Handle Dragging Placed Components on Canvas
  const handleCanvasMouseDown = (e: React.MouseEvent, plCompId: string) => {
    e.stopPropagation()
    const comp = placedComponents.find(c => c.id === plCompId)
    if (!comp || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / zoom
    const mouseY = (e.clientY - rect.top) / zoom

    dragOffset.current = {
      x: mouseX - comp.x,
      y: mouseY - comp.y
    }
    setDraggingCompId(plCompId)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / zoom
    const mouseY = (e.clientY - rect.top) / zoom

    // Update dragging component position
    if (draggingCompId) {
      const updated = placedComponents.map(c => {
        if (c.id === draggingCompId) {
          const rawX = mouseX - dragOffset.current.x
          const rawY = mouseY - dragOffset.current.y
          return {
            ...c,
            x: Math.max(10, snapToGrid(rawX)),
            y: Math.max(10, snapToGrid(rawY))
          }
        }
        return c
      })
      onUpdateComponents(updated)
    }

    // Update mouse position for wire drawing line preview
    if (wireStart) {
      setMousePos({ x: mouseX, y: mouseY })
    }
  }

  const handleCanvasMouseUp = () => {
    setDraggingCompId(null)
  }

  // Cancel drawing wire on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setWireStart(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [wireStart])

  // Get absolute Pin Coordinates for connecting wires
  const getPinCoords = (plCompId: string, pinId: string) => {
    const comp = placedComponents.find(c => c.id === plCompId)
    if (!comp) return { x: 0, y: 0 }

    const def = LAB_COMPONENTS[comp.componentId]
    if (!def) return { x: 0, y: 0 }

    const pin = def.pins.find(p => p.id === pinId)
    if (!pin) return { x: 0, y: 0 }

    const scale = comp.scale || 1.0
    const rotation = comp.rotation || 0

    // Component center coordinates
    const cx = comp.x + (def.width * scale) / 2
    const cy = comp.y + (def.height * scale) / 2

    // Unrotated pin coordinates relative to the canvas
    const px = comp.x + pin.x * scale
    const py = comp.y + pin.y * scale

    if (rotation === 0) {
      return { x: px, y: py }
    }

    // Convert rotation to radians
    const rad = (rotation * Math.PI) / 180
    // Rotate coordinates around (cx, cy)
    const rx = cx + (px - cx) * Math.cos(rad) - (py - cy) * Math.sin(rad)
    const ry = cy + (px - cx) * Math.sin(rad) + (py - cy) * Math.cos(rad)

    return { x: rx, y: ry }
  }

  // Click on a Pin
  const handlePinClick = (e: React.MouseEvent, plCompId: string, pinId: string) => {
    e.stopPropagation()
    const coords = getPinCoords(plCompId, pinId)

    if (!wireStart) {
      // Start Drawing Wire
      setWireStart({
        compId: plCompId,
        pinId,
        x: coords.x,
        y: coords.y
      })
      setMousePos({ x: coords.x, y: coords.y })
    } else {
      // Connect / Complete Drawing Wire
      if (wireStart.compId === plCompId && wireStart.pinId === pinId) {
        // Cannot connect pin to itself
        setWireStart(null)
        return
      }

      // Check if duplicate wire connection already exists
      const duplicate = connections.some(w => 
        (w.fromComponentId === wireStart.compId && w.fromPinId === wireStart.pinId && w.toComponentId === plCompId && w.toPinId === pinId) ||
        (w.fromComponentId === plCompId && w.fromPinId === pinId && w.toComponentId === wireStart.compId && w.toPinId === wireStart.pinId)
      )

      if (!duplicate) {
        const newWire: WireConnection = {
          fromComponentId: wireStart.compId,
          fromPinId: wireStart.pinId,
          toComponentId: plCompId,
          toPinId: pinId,
          color: activeWireColor
        }
        setConnectionsHistory(prev => [...prev, connections])
        onUpdateConnections([...connections, newWire])
      }
      setWireStart(null)
    }
  }

  // Clear Canvas
  const handleClearCanvas = () => {
    setConnectionsHistory(prev => [...prev, connections])
    onUpdateComponents([])
    onUpdateConnections([])
    setWireStart(null)
  }

  // Auto Arrange components nicely
  const handleAutoArrange = () => {
    const arranged = placedComponents.map((c, idx) => ({
      ...c,
      x: 100 + (idx % 3) * 200,
      y: 80 + Math.floor(idx / 3) * 160
    }))
    onUpdateComponents(arranged)
    onUpdateConnections([]) // Wires reset for neatness
    setWireStart(null)
  }

  const handleDeleteComponent = (compId: string) => {
    setConnectionsHistory(prev => [...prev, connections])
    onUpdateComponents(placedComponents.filter(c => c.id !== compId))
    onUpdateConnections(connections.filter(conn => 
      conn.fromComponentId !== compId && conn.toComponentId !== compId
    ))
  }

  const handleScaleComponent = (plCompId: string, delta: number) => {
    const updated = placedComponents.map(c => {
      if (c.id === plCompId) {
        const currentScale = c.scale || 1.0
        const newScale = Math.min(2.0, Math.max(0.5, currentScale + delta))
        return {
          ...c,
          scale: newScale
        }
      }
      return c
    })
    onUpdateComponents(updated)
  }

  return (
    <div className="flex-1 bg-[#070707] flex flex-col relative h-full overflow-hidden text-white select-none">
      
      {/* ─── Toolbar (2-row, clean) ─── */}
      <div className="flex flex-col border-b border-gray-800 bg-[#0d0d0d] px-4 py-2.5 gap-2 select-none flex-shrink-0">

        {/* Row 1 — 2-Column grid */}
        <div className="grid grid-cols-2 gap-3 items-center">

          {/* LEFT: Simulation Controls */}
          {onUpload ? (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111] border border-gray-800 rounded-lg shrink-0">
                <span className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                  isSimulating  ? "bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]"
                  : passed      ? "bg-green-500 shadow-[0_0_5px_#22c55e]"
                  : passed===false ? "bg-red-500 shadow-[0_0_5px_#ef4444]"
                  :                 "bg-yellow-500 animate-pulse shadow-[0_0_5px_#eab308]"
                }`} />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {isSimulating ? "RUNNING" : passed ? "PASSED" : passed===false ? "FAILED" : "STANDBY"}
                </span>
              </div>

              {/* Verify */}
              <button
                onClick={onRun}
                disabled={isSimulating}
                className="px-3 py-1.5 bg-[#111] hover:bg-white/8 disabled:opacity-40 border border-gray-700 hover:border-gray-600 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                title="Verify & Compile"
              >
                Verify
              </button>

              {/* Upload & Run */}
              <button
                onClick={onUpload}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:bg-red-900 text-[10px] font-bold text-white rounded-lg transition-all shadow-md shadow-red-900/30 cursor-pointer whitespace-nowrap"
                title="Flash & Run"
              >
                <Cpu className="w-3 h-3 shrink-0" />
                Upload &amp; Run
              </button>

              {/* Reset */}
              <button
                onClick={onClear}
                className="p-1.5 bg-[#111] hover:bg-white/8 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : <div />}

          {/* RIGHT: View & Edit Controls */}
          <div className="flex items-center justify-end gap-2">

            {/* Zoom group */}
            <div className="flex items-center bg-[#111] border border-gray-800 rounded-lg overflow-hidden divide-x divide-gray-800">
              <button
                onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
                className="px-2 py-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[9px] font-mono w-9 text-center font-bold text-gray-400 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                className="px-2 py-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <span className="w-px h-5 bg-gray-800 shrink-0" />

            {/* Auto-arrange */}
            <button
              onClick={handleAutoArrange}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111] hover:bg-white/5 border border-gray-800 hover:border-gray-700 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition whitespace-nowrap"
              title="Auto Arrange"
            >
              <Sliders className="w-3 h-3 text-red-500 shrink-0" />
              Grid
            </button>

            {/* Reset Zoom */}
            <button
              onClick={() => setZoom(1.0)}
              className="p-1.5 bg-[#111] hover:bg-white/5 border border-gray-800 hover:border-gray-700 rounded-lg text-gray-400 hover:text-white transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Undo */}
            <button
              onClick={handleUndo}
              disabled={connectionsHistory.length === 0}
              className="p-1.5 bg-[#111] hover:bg-white/5 border border-gray-800 disabled:opacity-25 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
              title="Undo Last Wire"
            >
              <Undo className="w-3 h-3" />
            </button>

            {/* Clear Canvas */}
            <button
              onClick={handleClearCanvas}
              className="p-1.5 bg-red-950/50 hover:bg-red-600 border border-red-900/40 hover:border-red-500 rounded-lg text-red-400 hover:text-white transition"
              title="Clear Canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2 — Wire Colors */}
        <div className="flex items-center gap-2 border-t border-gray-800/40 pt-2">
          <span className="text-[8.5px] text-gray-600 font-bold uppercase tracking-widest shrink-0">Wire:</span>
          {[
            { id: "red",    hex: "#ef4444" },
            { id: "black",  hex: "#374151" },
            { id: "yellow", hex: "#eab308" },
            { id: "green",  hex: "#22c55e" },
            { id: "blue",   hex: "#3b82f6" },
            { id: "purple", hex: "#a855f7" },
            { id: "orange", hex: "#f97316" },
            { id: "cyan",   hex: "#06b6d4" },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setActiveWireColor(c.id)}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 rounded-full transition-all ${
                activeWireColor === c.id
                  ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d0d0d] scale-125"
                  : "opacity-50 hover:opacity-90 hover:scale-110"
              }`}
              title={c.id}
            />
          ))}
          {/* Active label */}
          <span className="ml-1 text-[9px] font-mono font-bold capitalize text-gray-500">
            {activeWireColor}
          </span>
        </div>

      </div>

      {/* Grid Canvas Workspace */}
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={() => setSelectedCompId(null)}
        className={`flex-1 relative overflow-auto custom-scrollbar cursor-crosshair transition-colors duration-300 ${
          isNightMode === false ? "bg-[#f3f4f6]" : "bg-[#070707]"
        }`}
        style={{
          backgroundImage: isNightMode === false
            ? "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)"
            : "radial-gradient(#222 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Connection Instruction Prompt Overlay */}
        {wireStart && (
          <div className="absolute top-4 left-4 z-10 py-1.5 px-3 bg-red-650/90 border border-red-500/20 backdrop-blur rounded-lg text-[10px] uppercase font-bold tracking-widest text-white shadow-lg animate-pulse">
            📍 Selecting Target Pin... press [ESC] to Cancel
          </div>
        )}

        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            width: "2000px",
            height: "2000px"
          }}
          className="absolute top-0 left-0"
        >
          {/* Wire SVG Layer */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {/* Draw Permanent Wires */}
            {connections.map((wire, idx) => {
              const start = getPinCoords(wire.fromComponentId, wire.fromPinId)
              const end = getPinCoords(wire.toComponentId, wire.toPinId)
              
              // Draw an elegant curved cubic bezier wire paths
              const dx = Math.abs(end.x - start.x) * 0.4
              const dy = Math.abs(end.y - start.y) * 0.4
              const path = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y + (end.y > start.y ? dy : -dy)} ${end.x - dx} ${end.y + (end.y > start.y ? -dy : dy)} ${end.x} ${end.y}`
              
              let strokeColor = "#eab308"
              let shadowColor = "rgba(234,179,8,0.2)"
              
              if (wire.color === "red") {
                strokeColor = "#ef4444"
                shadowColor = "rgba(239,68,68,0.3)"
              } else if (wire.color === "black") {
                strokeColor = "#1f2937"
                shadowColor = "rgba(31,41,55,0.4)"
              } else if (wire.color === "yellow") {
                strokeColor = "#eab308"
                shadowColor = "rgba(234,179,8,0.3)"
              } else if (wire.color === "green") {
                strokeColor = "#22c55e"
                shadowColor = "rgba(34,197,94,0.3)"
              } else if (wire.color === "blue") {
                strokeColor = "#3b82f6"
                shadowColor = "rgba(59,130,246,0.3)"
              } else if (wire.color === "purple") {
                strokeColor = "#a855f7"
                shadowColor = "rgba(168,85,247,0.3)"
              } else if (wire.color === "orange") {
                strokeColor = "#f97316"
                shadowColor = "rgba(249,115,22,0.3)"
              } else if (wire.color === "cyan") {
                strokeColor = "#06b6d4"
                shadowColor = "rgba(6,182,212,0.3)"
              }

              return (
                <g key={idx}>
                  {/* Glowing Outline */}
                  <path
                    d={path}
                    fill="none"
                    stroke={shadowColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Core Wire */}
                  <path
                    d={path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className={`transition-all ${isSimulating ? "animate-dash" : ""}`}
                  />
                </g>
              )
            })}

            {/* Draw Wire Drawing Preview */}
            {wireStart && (
              <g>
                {(() => {
                  let previewColor = "#eab308"
                  if (activeWireColor === "red") previewColor = "#ef4444"
                  else if (activeWireColor === "black") previewColor = "#4b5563"
                  else if (activeWireColor === "yellow") previewColor = "#eab308"
                  else if (activeWireColor === "green") previewColor = "#22c55e"
                  else if (activeWireColor === "blue") previewColor = "#3b82f6"
                  else if (activeWireColor === "purple") previewColor = "#a855f7"
                  else if (activeWireColor === "orange") previewColor = "#f97316"
                  else if (activeWireColor === "cyan") previewColor = "#06b6d4"
                  
                  return (
                    <>
                      <line
                        x1={wireStart.x}
                        y1={wireStart.y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke={previewColor}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                      <circle
                        cx={mousePos.x}
                        cy={mousePos.y}
                        r="5"
                        fill={previewColor}
                      />
                    </>
                  )
                })()}
              </g>
            )}
          </svg>

          {/* Render Placed Hardware Components */}
          {placedComponents.map(comp => {
            const def = LAB_COMPONENTS[comp.componentId]
            if (!def) return null

            const isImageComponent = !!def.imageUrl
            const scale = comp.scale || 1.0
            const rotation = comp.rotation || 0
            const isSelected = selectedCompId === comp.id

            const renderCustomHardware = () => {
              switch (comp.componentId) {
                case "breadboard":
                  return (
                    <div className="w-full h-full bg-[#f8f6f0] border border-[#e6e2d3] rounded-md shadow-md p-1 flex flex-col justify-between font-mono relative overflow-hidden select-none">
                      {/* Power Rails (Top) */}
                      <div className="flex items-center justify-between border-b border-[#e2dec9] pb-0.5">
                        <span className="text-[6px] font-bold text-blue-600">-</span>
                        <div className="flex gap-1 flex-1 justify-center">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <span key={i} className="w-0.5 h-0.5 rounded-full bg-gray-400 opacity-60" />
                          ))}
                        </div>
                        <span className="text-[6px] font-bold text-red-650">+</span>
                      </div>

                      {/* Row Grids */}
                      <div className="flex-1 flex flex-col justify-center gap-0.5 py-0.5">
                        <div className="flex flex-col gap-0.5">
                          {Array.from({ length: 4 }).map((_, r) => (
                            <div key={r} className="flex gap-1 justify-center">
                              {Array.from({ length: 14 }).map((_, c) => (
                                <span key={c} className="w-0.5 h-0.5 rounded-full bg-gray-400 opacity-60" />
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="h-px bg-gray-300 w-full opacity-60" />
                        <div className="flex flex-col gap-0.5">
                          {Array.from({ length: 4 }).map((_, r) => (
                            <div key={r} className="flex gap-1 justify-center">
                              {Array.from({ length: 14 }).map((_, c) => (
                                <span key={c} className="w-0.5 h-0.5 rounded-full bg-gray-400 opacity-60" />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Power Rails (Bottom) */}
                      <div className="flex items-center justify-between border-t border-[#e2dec9] pt-0.5">
                        <span className="text-[6px] font-bold text-blue-600">-</span>
                        <div className="flex gap-1 flex-1 justify-center">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <span key={i} className="w-0.5 h-0.5 rounded-full bg-gray-400 opacity-60" />
                          ))}
                        </div>
                        <span className="text-[6px] font-bold text-red-650">+</span>
                      </div>
                    </div>
                  );
                case "led-red":
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                      <div className="absolute top-[30px] flex gap-2">
                        <div className="w-0.5 h-5 bg-slate-450" />
                        <div className="w-0.5 h-7 bg-slate-450" />
                      </div>
                      <div 
                        className={`w-8 h-8 rounded-full border border-red-750/30 transition-all duration-300 ${
                          ledActive || isSimulating
                            ? "bg-red-500 shadow-[0_0_20px_#ef4444,0_0_40px_#ef4444,0_0_60px_#ef4444bb]" 
                            : "bg-red-900/60"
                        }`} 
                      />
                      {(ledActive || isSimulating) && (
                        <div className="absolute w-14 h-14 rounded-full bg-red-500/10 animate-ping pointer-events-none" />
                      )}
                      <span className={`text-[7px] font-bold mt-0.5 uppercase font-mono tracking-wider transition-colors ${
                        ledActive || isSimulating ? "text-red-400" : "text-red-800"
                      }`}>LED</span>
                    </div>
                  );
                case "rgb-led":
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                      <div className="absolute top-[30px] flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-0.5 h-5 bg-slate-450" />
                        ))}
                      </div>
                      <div 
                        className={`w-8 h-8 rounded-full border border-gray-700/35 transition-all duration-500 ${
                          isSimulating 
                            ? "bg-cyan-400 shadow-[0_0_20px_#22d3ee,0_0_35px_#22d3ee]" 
                            : "bg-white/20"
                        }`} 
                      />
                      <span className="text-[7px] font-bold text-cyan-400 mt-0.5 uppercase font-mono tracking-wider">RGB</span>
                    </div>
                  );
                case "buzzer":
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center relative select-none bg-[#111] rounded-full border-2 border-[#333] shadow-inner p-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-black border border-gray-800 flex items-center justify-center">
                        <div className="w-1 h-1 bg-gray-705 rounded-full" />
                      </div>
                      <span className={`text-[7px] font-bold mt-0.5 font-mono transition-colors ${
                        buzzerActive ? "text-red-400" : "text-gray-500"
                      }`}>BUZZ</span>
                      {buzzerActive && (
                        <>
                          <div className="absolute inset-0 border border-red-500/50 rounded-full animate-ping pointer-events-none" />
                          <div className="absolute inset-[-4px] border border-orange-500/30 rounded-full animate-ping pointer-events-none [animation-delay:0.2s]" />
                        </>
                      )}
                      {isSimulating && !buzzerActive && (
                        <div className="absolute inset-0 border border-red-500/30 rounded-full animate-ping pointer-events-none" />
                      )}
                    </div>
                  );
                case "servo-motor":
                  return (
                    <div className="w-full h-full bg-[#1e3a8a] border border-blue-900 rounded-lg p-1 flex flex-col justify-between font-mono relative overflow-hidden select-none">
                      <span className="text-[7px] font-bold text-blue-300">SERVO</span>
                      <div className="flex-1 flex items-center justify-center relative">
                        <div 
                          style={{
                            transform: isSimulating ? `rotate(${(Math.sin(Date.now() / 150) * 60) + 90}deg)` : "rotate(90deg)",
                            transformOrigin: "center center",
                            transition: "transform 0.1s linear"
                          }}
                          className="w-8 h-2.5 bg-white border border-gray-300 rounded-full flex items-center justify-between px-1"
                        >
                          <circle cx="2" cy="2" r="0.7" fill="#475569" />
                          <circle cx="6" cy="2" r="0.7" fill="#ef4444" />
                        </div>
                      </div>
                    </div>
                  );
                case "dc-motor":
                case "geared-dc-motor":
                  return (
                    <div className="w-full h-full bg-[#b45309] border border-amber-850 rounded-lg p-1 flex items-center justify-between font-mono relative overflow-hidden select-none">
                      <div className="flex flex-col">
                        <span className="text-[7px] font-bold text-amber-200">GEAR</span>
                        <span className="text-[5px] text-gray-400">3V</span>
                      </div>
                      <div 
                        style={{
                          transform: isSimulating ? `rotate(${Date.now() / 4 % 360}deg)` : "rotate(0deg)",
                          transformOrigin: "center center"
                        }}
                        className="w-8 h-8 rounded-full border-4 border-dashed border-black bg-slate-800 flex items-center justify-center shadow-md shrink-0"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-black" />
                      </div>
                    </div>
                  );
                case "potentiometer":
                  return (
                    <div className="w-full h-full bg-[#047857] border border-emerald-800 rounded-xl p-1 flex flex-col justify-between select-none">
                      <span className="text-[7px] font-bold text-emerald-250 uppercase font-mono">10k POT</span>
                      <div className="flex-1 flex items-center justify-center">
                        <div 
                          style={{
                            transform: isSimulating ? `rotate(${Math.sin(Date.now() / 300) * 120}deg)` : "rotate(0deg)",
                            transition: "transform 0.1s ease"
                          }}
                          className="w-7 h-7 rounded-full border-2 border-slate-400 bg-slate-300 flex items-center justify-center relative cursor-pointer shadow-md"
                        >
                          <div className="w-0.5 h-2.5 bg-red-650 rounded absolute top-0" />
                        </div>
                      </div>
                    </div>
                  );
                case "push-button":
                  return (
                    <div className="w-full h-full bg-[#374151] border border-gray-700 rounded-md p-1 flex flex-col justify-between select-none shadow-md">
                      <span className="text-[6px] text-gray-450 uppercase font-mono font-bold">BUTTON</span>
                      <div className="flex-1 flex items-center justify-center">
                        <div 
                          className={`w-5 h-5 rounded-full border border-red-800 flex items-center justify-center transition-all cursor-pointer ${
                            isSimulating ? "bg-red-500 scale-95 shadow-inner" : "bg-red-700 hover:bg-red-650 shadow"
                          }`}
                        />
                      </div>
                    </div>
                  );
                case "resistor":
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                      <div className="w-full h-0.5 bg-slate-400 absolute" />
                      <div className="w-10 h-3.5 bg-[#f0e68c] border border-yellow-600 rounded flex items-center justify-between px-1 relative z-10">
                        <div className="w-0.5 h-full bg-red-850" />
                        <div className="w-0.5 h-full bg-red-850" />
                        <div className="w-0.5 h-full bg-[#78350f]" />
                        <div className="w-0.5 h-full bg-amber-500" />
                      </div>
                      <span className="text-[6.5px] font-bold text-yellow-600 mt-0.5 font-mono">220Ω</span>
                    </div>
                  );
                case "obj-box":
                  return (
                    <svg viewBox="0 0 80 85" className="w-full h-full select-none pointer-events-none">
                      <defs>
                        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>
                        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="76" height="81" rx="4" fill="url(#woodGrad)" stroke="#451a03" strokeWidth="2" />
                      <rect x="8" y="8" width="64" height="69" fill="none" stroke="#451a03" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="8" y1="8" x2="72" y2="77" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                      <line x1="8" y1="8" x2="72" y2="77" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
                      <line x1="72" y1="8" x2="8" y2="77" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                      <line x1="72" y1="8" x2="8" y2="77" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
                      <line x1="8" y1="42" x2="72" y2="42" stroke="#451a03" strokeWidth="2" />
                      {/* Metal corners */}
                      <path d="M 2 12 L 12 2 L 2 2 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="0.5" />
                      <circle cx="5" cy="5" r="0.8" fill="#cbd5e1" />
                      <path d="M 78 12 L 68 2 L 78 2 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="0.5" />
                      <circle cx="75" cy="5" r="0.8" fill="#cbd5e1" />
                      <path d="M 2 73 L 12 83 L 2 83 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="0.5" />
                      <circle cx="5" cy="80" r="0.8" fill="#cbd5e1" />
                      <path d="M 78 73 L 68 83 L 78 83 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="0.5" />
                      <circle cx="75" cy="80" r="0.8" fill="#cbd5e1" />
                      <text x="40" y="52" fill="#451a03" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.85" letterSpacing="1">FRAGILE</text>
                      <path d="M 36 22 L 44 22 L 44 26 L 41 29 L 41 33 L 43 33 L 43 35 L 37 35 L 37 33 L 39 33 L 39 29 L 36 26 Z" fill="#451a03" opacity="0.75" />
                    </svg>
                  );
                case "obj-water":
                  return (
                    <svg viewBox="0 0 90 60" className="w-full h-full select-none pointer-events-none">
                      <defs>
                        <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                          <stop offset="70%" stopColor="#2563eb" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.95" />
                        </radialGradient>
                        <linearGradient id="reflectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 15 30 Q 10 15 25 12 Q 40 10 55 15 Q 70 8 80 20 Q 88 35 75 48 Q 62 55 45 52 Q 25 55 18 42 Z" 
                        fill="url(#waterGrad)" 
                        stroke="#1e40af" 
                        strokeWidth="1.5" 
                      />
                      <path d="M 22 18 Q 35 15 48 18 Q 40 22 25 21 Z" fill="url(#reflectGrad)" />
                      <path d="M 58 19 Q 68 14 74 22 Q 68 22 60 20 Z" fill="url(#reflectGrad)" />
                      {isSimulating ? (
                        <>
                          <ellipse cx="45" cy="30" rx="15" ry="8" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.8">
                            <animate attributeName="rx" values="10;30" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="ry" values="5;15" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                          </ellipse>
                          <ellipse cx="45" cy="30" rx="25" ry="12" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.4">
                            <animate attributeName="rx" values="20;40" dur="2s" begin="0.7s" repeatCount="indefinite" />
                            <animate attributeName="ry" values="10;20" dur="2s" begin="0.7s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0" dur="2s" begin="0.7s" repeatCount="indefinite" />
                          </ellipse>
                        </>
                      ) : (
                        <ellipse cx="45" cy="30" rx="18" ry="9" fill="none" stroke="#93c5fd" strokeWidth="0.75" opacity="0.5" />
                      )}
                      <circle cx="12" cy="22" r="1.5" fill="#60a5fa" opacity="0.7" />
                      <circle cx="82" cy="40" r="2" fill="#3b82f6" opacity="0.8" />
                    </svg>
                  );
                case "obj-gas":
                  return (
                    <svg viewBox="0 0 90 80" className="w-full h-full select-none pointer-events-none">
                      <defs>
                        <radialGradient id="gasGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#854d0e" stopOpacity="0.75" />
                          <stop offset="60%" stopColor="#78350f" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <g className={isSimulating ? "animate-pulse" : ""} style={{ transformOrigin: "center" }}>
                        <circle cx="35" cy="40" r="25" fill="url(#gasGrad)" />
                        <circle cx="55" cy="45" r="22" fill="url(#gasGrad)" />
                        <circle cx="45" cy="30" r="20" fill="url(#gasGrad)" />
                        <circle cx="25" cy="50" r="18" fill="url(#gasGrad)" />
                        <circle cx="65" cy="35" r="15" fill="url(#gasGrad)" />
                        <path 
                          d="M20,45 C15,35 30,25 40,30 C50,20 65,30 70,40 C80,45 75,60 60,60 C50,65 35,62 30,55 C15,55 18,48 20,45 Z" 
                          fill="#a16207" 
                          opacity="0.15" 
                        />
                      </g>
                      <g transform="translate(33, 28)">
                        <polygon points="12,2 24,22 0,22" fill="#eab308" stroke="#1e293b" strokeWidth="1" />
                        <path d="M12,7 C10.5,7 9.5,8 9.5,9.5 C9.5,11 10.5,11.5 10.5,12.5 L10.5,14 C10.5,14.5 11,15 11.5,15 C12,15 12.5,15 13,15 C13.5,15 13.5,14.5 13.5,14 L13.5,12.5 C13.5,11.5 14.5,11 14.5,9.5 C14.5,8 13.5,7 12,7 Z" fill="#000" />
                        <circle cx="11" cy="9.5" r="0.7" fill="#eab308" />
                        <circle cx="13" cy="9.5" r="0.7" fill="#eab308" />
                        <path d="M7,21 L17,21" stroke="#000" strokeWidth="1" />
                      </g>
                    </svg>
                  );
                case "obj-human":
                  return (
                    <svg viewBox="0 0 70 90" className="w-full h-full select-none pointer-events-none">
                      <defs>
                        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                        <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      <ellipse cx="35" cy="80" rx="20" ry="6" fill="#000" opacity="0.25" />
                      {isSimulating && (
                        <>
                          <circle cx="35" cy="45" r="30" fill="none" stroke="#db2777" strokeWidth="1" opacity="0.4" strokeDasharray="3,3">
                            <animate attributeName="r" values="20;45" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.4;0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                      <g filter="url(#shadow)">
                        <path 
                          d="M 16 35 C 10 42 12 55 15 58 C 17 60 19 55 19 45 Z" 
                          fill="#fbcfe8" 
                          stroke="#db2777" 
                          strokeWidth="1" 
                          className={isSimulating ? "animate-char-arm-left" : ""}
                        />
                        <path 
                          d="M 54 35 C 60 42 58 55 55 58 C 53 60 51 55 51 45 Z" 
                          fill="#fbcfe8" 
                          stroke="#db2777" 
                          strokeWidth="1" 
                          className={isSimulating ? "animate-char-arm-right" : ""}
                        />
                        <rect 
                          x="22" 
                          y="58" 
                          width="10" 
                          height="18" 
                          rx="2" 
                          fill="url(#pantsGrad)" 
                          className={isSimulating ? "animate-char-leg-left" : ""}
                        />
                        <rect 
                          x="20" 
                          y="75" 
                          width="12" 
                          height="5" 
                          rx="1.5" 
                          fill="#1e293b" 
                          className={isSimulating ? "animate-char-leg-left" : ""}
                        />
                        <rect 
                          x="38" 
                          y="58" 
                          width="10" 
                          height="18" 
                          rx="2" 
                          fill="url(#pantsGrad)" 
                          className={isSimulating ? "animate-char-leg-right" : ""}
                        />
                        <rect 
                          x="38" 
                          y="75" 
                          width="12" 
                          height="5" 
                          rx="1.5" 
                          fill="#1e293b" 
                          className={isSimulating ? "animate-char-leg-right" : ""}
                        />
                        <path d="M 18 35 L 52 35 L 48 60 L 22 60 Z" fill="url(#shirtGrad)" stroke="#991b1b" strokeWidth="1" />
                        <path d="M 28 35 L 35 43 L 42 35 Z" fill="#fbcfe8" />
                        <circle cx="35" cy="22" r="10" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                        <path d="M 25 22 C 25 10 45 10 45 22 C 45 16 38 14 35 15 C 32 14 25 16 25 22 Z" fill="url(#hairGrad)" />
                      </g>
                    </svg>
                  );
                case "obj-rfid-card":
                  return (
                    <svg viewBox="0 0 80 50" className="w-full h-full select-none pointer-events-none">
                      <defs>
                        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#1e1b4b" />
                        </linearGradient>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#ca8a04" />
                          <stop offset="100%" stopColor="#854d0e" />
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="76" height="46" rx="3" fill="url(#cardGrad)" stroke="#312e81" strokeWidth="1.5" />
                      <rect x="5" y="5" width="70" height="40" rx="2" fill="none" stroke="#eab308" strokeWidth="0.5" strokeDasharray="10, 5" opacity="0.3" />
                      <rect x="7" y="7" width="66" height="36" rx="1.5" fill="none" stroke="#eab308" strokeWidth="0.5" opacity="0.2" />
                      <rect x="12" y="18" width="12" height="10" rx="1" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="0.5" />
                      <line x1="18" y1="18" x2="18" y2="28" stroke="#78350f" strokeWidth="0.5" />
                      <line x1="12" y1="23" x2="24" y2="23" stroke="#78350f" strokeWidth="0.5" />
                      <line x1="15" y1="23" x2="15" y2="28" stroke="#78350f" strokeWidth="0.5" />
                      <line x1="21" y1="23" x2="21" y2="28" stroke="#78350f" strokeWidth="0.5" />
                      <path d="M 52 20 A 4 4 0 0 1 52 26" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                      <path d="M 55 17 A 8 8 0 0 1 55 29" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                      <path d="M 58 14 A 12 12 0 0 1 58 32" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                      <circle cx="48" cy="23" r="1.5" fill="#ffffff" />
                      <text x="70" y="42" fill="#ffffff" fontSize="4.5" fontFamily="monospace" textAnchor="end" opacity="0.6">13.56 MHz</text>
                      <text x="12" y="42" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" opacity="0.8" letterSpacing="0.5">RFID PASS</text>
                      {isSimulating && (
                        <>
                          <circle cx="70" cy="10" r="1.5" fill="#22c55e" />
                          <circle cx="70" cy="10" r="3.5" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.8">
                            <animate attributeName="r" values="2;6" dur="1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                    </svg>
                  );
                default:
                  return (
                    <div
                      style={{ backgroundColor: def.color + "1a", borderColor: def.color + "44" }}
                      className="w-full h-full rounded border border-dashed flex items-center justify-center text-[9px] uppercase tracking-widest font-mono text-gray-500"
                    >
                      {def.id.slice(0, 8)}
                    </div>
                  );
              }
            };

            if (isImageComponent) {
              return (
                <div
                  key={comp.id}
                  style={{
                    left: comp.x,
                    top: comp.y,
                    width: def.width * scale,
                    height: def.height * scale,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  className={`absolute select-none group cursor-grab active:cursor-grabbing z-20 rounded-xl transition-shadow ${
                    isSelected ? "ring-2 ring-red-500 shadow-[0_0_15px_#E50914] bg-red-950/5" : ""
                  }`}
                  onMouseDown={(e) => {
                    handleCanvasMouseDown(e, comp.id)
                    setSelectedCompId(comp.id)
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleDeleteComponent(comp.id)}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-red-650 hover:bg-red-600 rounded-full border border-red-900/30 flex items-center justify-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl cursor-pointer z-40"
                    title="Remove Component"
                  >
                    ✕
                  </button>

                  {/* Floating Stretch Size Buttons Pill */}
                  <div 
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0c0c0cd8] border border-gray-800 rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-2xl z-30"
                  >
                    <button
                      onClick={() => handleScaleComponent(comp.id, -0.1)}
                      className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                      title="Decrease Size"
                    >
                      －
                    </button>
                    <span className="text-[8.5px] font-mono font-bold text-gray-400 min-w-8 text-center select-none">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => handleScaleComponent(comp.id, 0.1)}
                      className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                      title="Increase Size"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Realistic Top-down Image with hover outline glow */}
                  <div className="w-full h-full relative transition-all duration-200 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.5)] group-hover:scale-[1.02]">
                    <img
                      src={def.imageUrl}
                      alt={def.name}
                      className="w-full h-full object-fill select-none pointer-events-none"
                      style={{ mixBlendMode: "screen" }}
                    />
                  </div>

                  {/* Render Connective Pins as Realistic Brass/Gold Solder Pads / Header Sockets */}
                  {def.pins.map(pin => {
                    const connectedWire = connections.find(w => 
                      (w.fromComponentId === comp.id && w.fromPinId === pin.id) ||
                      (w.toComponentId === comp.id && w.toPinId === pin.id)
                    )
                    const wireColorHex = connectedWire ? getWireHexColor(connectedWire.color) : undefined

                    return (
                      <button
                        key={pin.id}
                        style={{
                          left: pin.x * scale - 7,
                          top: pin.y * scale - 7,
                          borderColor: wireColorHex,
                          boxShadow: wireColorHex ? `0 0 8px ${wireColorHex}` : undefined
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => handlePinClick(e, comp.id, pin.id)}
                        className={`absolute w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center group/pin cursor-pointer transition-all duration-150 z-30 ${
                          wireStart?.compId === comp.id && wireStart?.pinId === pin.id
                            ? "bg-red-600 border-red-400 scale-125 animate-pulse shadow-[0_0_8px_#ef4444]"
                            : "bg-black/90 hover:bg-red-650/60 border-[#c2a649] hover:border-red-400 shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                        }`}
                      >
                        {/* Tiny center node */}
                        <span 
                          className="w-1.5 h-1.5 bg-[#d8b4fe]/40 group-hover/pin:bg-white rounded-full transition-colors" 
                          style={{
                            backgroundColor: wireColorHex
                          }}
                        />
                        
                        {/* Tooltip Label */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 py-0.5 px-1.5 bg-black/95 border border-gray-800 text-[8px] font-mono text-gray-300 rounded opacity-0 group-hover/pin:opacity-100 transition duration-150 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                          {pin.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            }

            if (comp.componentId.startsWith("obj-")) {
              return (
                <div
                  key={comp.id}
                  style={{
                    left: comp.x,
                    top: comp.y,
                    width: def.width * scale,
                    height: def.height * scale,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  className={`absolute select-none group z-20 cursor-grab active:cursor-grabbing transition-all rounded-lg overflow-visible ${
                    isSelected ? "ring-2 ring-red-500 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(239,68,68,0.7)]" : ""
                  }`}
                  onMouseDown={(e) => {
                    handleCanvasMouseDown(e, comp.id)
                    setSelectedCompId(comp.id)
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleDeleteComponent(comp.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-650 hover:bg-red-600 rounded-full border border-red-900/30 flex items-center justify-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer z-30"
                    title="Remove Object"
                  >
                    ✕
                  </button>

                  {/* Floating Stretch Size Buttons Pill */}
                  <div 
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0c0c0cd8] border border-gray-800 rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-2xl z-30"
                  >
                    <button
                      onClick={() => handleScaleComponent(comp.id, -0.1)}
                      className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                      title="Decrease Size"
                    >
                      －
                    </button>
                    <span className="text-[8.5px] font-mono font-bold text-gray-400 min-w-8 text-center select-none">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => handleScaleComponent(comp.id, 0.1)}
                      className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                      title="Increase Size"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Render Custom Object Visualizer */}
                  <div className="w-full h-full relative transition-all duration-200 group-hover:scale-[1.03]">
                    {renderCustomHardware()}
                  </div>
                </div>
              );
            }

            // Fallback for standard cards (like Breadboard, Potentiometer, active boards without custom textures)
            return (
              <div
                key={comp.id}
                style={{
                  left: comp.x,
                  top: comp.y,
                  width: def.width * scale,
                  height: def.height * scale,
                  borderColor: isSelected ? "#E50914" : def.color + "33",
                  backgroundColor: "#0d0d0df2",
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
                className={`absolute border rounded-xl p-2 select-none flex flex-col group z-20 transition-all ${
                  isSelected ? "ring-2 ring-red-500 shadow-[0_0_15px_#E50914]" : "shadow-2xl"
                }`}
                onMouseDown={(e) => {
                  handleCanvasMouseDown(e, comp.id)
                  setSelectedCompId(comp.id)
                }}
              >
                {/* Delete Button */}
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => handleDeleteComponent(comp.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-650 hover:bg-red-600 rounded-full border border-red-900/30 flex items-center justify-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                  title="Remove Component"
                >
                  ✕
                </button>

                {/* Floating Stretch Size Buttons Pill */}
                <div 
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0c0c0cd8] border border-gray-800 rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-2xl z-30"
                >
                  <button
                    onClick={() => handleScaleComponent(comp.id, -0.1)}
                    className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                    title="Decrease Size"
                  >
                    －
                  </button>
                  <span className="text-[8.5px] font-mono font-bold text-gray-400 min-w-8 text-center select-none">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => handleScaleComponent(comp.id, 0.1)}
                    className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold transition hover:text-white"
                    title="Increase Size"
                  >
                    ＋
                  </button>
                </div>

                {/* Hardware header */}
                <div className="flex items-center gap-1.5 border-b border-gray-800 pb-1.5 mb-1 text-left">
                  <span className="text-sm">{def.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-300 whitespace-normal break-words leading-tight tracking-wide">
                      {def.name}
                    </p>
                  </div>
                </div>

                {/* SVG/HTML Body preview block */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-lg">
                  {renderCustomHardware()}
                </div>

                {/* Render Connective Pins */}
                {def.pins.map(pin => {
                  const connectedWire = connections.find(w => 
                    (w.fromComponentId === comp.id && w.fromPinId === pin.id) ||
                    (w.toComponentId === comp.id && w.toPinId === pin.id)
                  )
                  const wireColorHex = connectedWire ? getWireHexColor(connectedWire.color) : undefined

                  return (
                    <button
                      key={pin.id}
                      style={{
                        left: pin.x * scale - 6,
                        top: pin.y * scale - 6,
                        borderColor: wireColorHex,
                        boxShadow: wireColorHex ? `0 0 8px ${wireColorHex}` : undefined
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => handlePinClick(e, comp.id, pin.id)}
                      className={`absolute w-3.5 h-3.5 rounded-full border flex items-center justify-center group/pin cursor-pointer transition ${
                        wireStart?.compId === comp.id && wireStart?.pinId === pin.id
                          ? "bg-red-600 border-red-400 scale-125 animate-pulse"
                          : "bg-gray-800 hover:bg-red-650/65 border-gray-600 hover:border-red-400"
                      }`}
                    >
                      {/* Tiny Center Pin Node */}
                      <span 
                        className="w-1.5 h-1.5 bg-gray-400 group-hover/pin:bg-white rounded-full" 
                        style={{
                          backgroundColor: wireColorHex
                        }}
                      />
                      
                      {/* Tooltip Label */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 py-0.5 px-1.5 bg-black border border-gray-800 text-[8px] font-mono text-gray-300 rounded opacity-0 group-hover/pin:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                        {pin.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes swing {
            from { transform: rotate(-10deg); }
            to { transform: rotate(10deg); }
          }
          @keyframes legSwing {
            from { transform: rotate(-15deg); }
            to { transform: rotate(15deg); }
          }
          .animate-char-arm-left {
            transform-origin: 16px 35px;
            animation: swing 0.6s ease-in-out infinite alternate;
          }
          .animate-char-arm-right {
            transform-origin: 54px 35px;
            animation: swing 0.6s ease-in-out infinite alternate-reverse;
          }
          .animate-char-leg-left {
            transform-origin: 27px 58px;
            animation: legSwing 0.6s ease-in-out infinite alternate;
          }
          .animate-char-leg-right {
            transform-origin: 43px 58px;
            animation: legSwing 0.6s ease-in-out infinite alternate-reverse;
          }
          @keyframes wire-dash {
            to {
              stroke-dashoffset: -20;
            }
          }
          .animate-dash {
            stroke-dasharray: 6, 4;
            animation: wire-dash 0.8s linear infinite !important;
          }
        `}</style>
      </div>
    </div>
  )
}
