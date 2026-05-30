"use client"

import { useState, useRef, useCallback } from "react"
import type { HeatmapBucket } from "@/lib/playerEvents"

export interface Chapter {
  title: string
  startSecond: number
}

interface SmartSeekBarProps {
  currentTime: number
  duration: number
  heatmap: HeatmapBucket[]
  chapters?: Chapter[]
  replayCount?: Record<number, number> // bucket startSecond → count
  onSeek: (time: number) => void
  onContextMenu?: (time: number) => void  // right-click to bookmark moment
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? "0" : ""}${sec}`
}

export default function SmartSeekBar({
  currentTime,
  duration,
  heatmap,
  chapters = [],
  onSeek,
  onContextMenu,
}: SmartSeekBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const [hoverX, setHoverX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  // Convert client X → video time
  const xToTime = useCallback((clientX: number): number => {
    if (!trackRef.current || duration <= 0) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return ratio * duration
  }, [duration])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const relX = e.clientX - rect.left
    setHoverX(relX)
    setHoverTime(xToTime(e.clientX))
    if (isDragging) {
      onSeek(xToTime(e.clientX))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    onSeek(xToTime(e.clientX))
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onContextMenu) {
      onContextMenu(xToTime(e.clientX))
    }
  }

  // Find chapter at hover time
  const hoveredChapter = [...chapters]
    .sort((a, b) => b.startSecond - a.startSecond)
    .find(c => hoverTime >= c.startSecond)

  // Find heatmap bucket at hover time
  const hoveredBucket = heatmap.find(
    b => hoverTime >= b.startSecond && hoverTime < b.endSecond
  )

  return (
    <div className="w-full flex items-center gap-3 select-none">
      {/* Current time */}
      <span className="text-[11px] font-semibold font-mono text-gray-400 whitespace-nowrap tabular-nums">
        {formatTime(currentTime)}
      </span>

      {/* Track container */}
      <div
        ref={trackRef}
        className="relative flex-1 cursor-pointer group/seek"
        style={{ height: hovering || isDragging ? 20 : 16 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); setIsDragging(false) }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onClick={e => { e.stopPropagation() }}
      >
        {/* Background track */}
        <div
          className="absolute inset-x-0 rounded-full bg-[#333] transition-all duration-150"
          style={{
            height: hovering || isDragging ? 10 : 6,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {/* Watched progress */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#666]"
            style={{ width: `${pct}%` }}
          />

          {/* Heatmap overlay segments */}
          {heatmap.map((bucket, i) => {
            if (duration <= 0) return null
            const left = (bucket.startSecond / duration) * 100
            const width = ((bucket.endSecond - bucket.startSecond) / duration) * 100

            return (
              <div key={i} className="absolute top-0 h-full pointer-events-none" style={{ left: `${left}%`, width: `${width}%` }}>
                {/* Replay intensity — red */}
                {bucket.replayIntensity > 15 && (
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      backgroundColor: "#E24B4A",
                      opacity: Math.min(0.85, bucket.replayIntensity / 100 * 0.9),
                    }}
                  />
                )}
                {/* Pause intensity — amber (only if no replay) */}
                {bucket.pauseIntensity > 20 && bucket.replayIntensity <= 15 && (
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      backgroundColor: "#EF9F27",
                      opacity: Math.min(0.75, bucket.pauseIntensity / 100 * 0.85),
                    }}
                  />
                )}
              </div>
            )
          })}

          {/* Red played-over portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#E50914] mix-blend-screen"
            style={{ width: `${pct}%`, opacity: 0.85 }}
          />

          {/* Chapter tick marks */}
          {chapters.map((chapter, i) => {
            if (duration <= 0 || chapter.startSecond <= 0) return null
            const pos = (chapter.startSecond / duration) * 100
            return (
              <div
                key={i}
                className="absolute top-0 h-full flex items-center pointer-events-none z-10"
                style={{ left: `${pos}%` }}
              >
                <div className="w-[2px] h-full bg-white opacity-60 rounded-full" />
              </div>
            )
          })}

          {/* Playhead thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${pct}%` }}
          >
            <div className={`rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25)] transition-all ${
              hovering || isDragging
                ? "w-4 h-4 border-2 border-[#E50914] shadow-[0_0_0_3px_rgba(229,9,20,0.25)]"
                : "w-3 h-3 border border-white/40"
            }`} />
          </div>
        </div>

        {/* Hover tooltip */}
        {hovering && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: Math.max(40, Math.min(hoverX, (trackRef.current?.offsetWidth ?? 200) - 40)),
              bottom: "calc(100% + 12px)",
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-black/95 border border-white/10 rounded-lg px-2.5 py-1.5 shadow-xl backdrop-blur-sm text-center min-w-[80px]">
              <div className="text-[12px] font-mono font-bold text-white">
                {formatTime(hoverTime)}
              </div>
              {hoveredChapter && (
                <div className="text-[10px] text-gray-400 mt-0.5 max-w-[120px] truncate">
                  {hoveredChapter.title}
                </div>
              )}
              {hoveredBucket && hoveredBucket.replayIntensity > 20 && (
                <div className="text-[9px] text-[#E24B4A] font-bold mt-0.5">
                  🔥 Replayed often
                </div>
              )}
              {hoveredBucket && hoveredBucket.pauseIntensity > 30 && hoveredBucket.replayIntensity <= 20 && (
                <div className="text-[9px] text-[#EF9F27] font-bold mt-0.5">
                  ⏸ Common pause point
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-black/95 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
          </div>
        )}

        {/* Right-click hint on hover */}
        {hovering && onContextMenu && (
          <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 text-[8px] text-gray-600 whitespace-nowrap pointer-events-none">
            Right-click to bookmark moment
          </div>
        )}
      </div>

      {/* Duration */}
      <span className="text-[11px] font-semibold font-mono text-gray-400 whitespace-nowrap tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}
