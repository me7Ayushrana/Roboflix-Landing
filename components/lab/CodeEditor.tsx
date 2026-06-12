"use client"

import React, { useState, useEffect, useRef } from "react"
import Editor, { Monaco, loader } from "@monaco-editor/react"

// Configure Monaco loader to use the robust and fast cdnjs alternative
loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs"
  }
})

interface CodeEditorProps {
  code: string
  onChange: (val: string) => void
}

// Fallback Native Code Editor Component
// Defined outside of CodeEditor to prevent React from rebuilding the component function
// on parent state change, resolving the cursor focus-loss bug completely.
interface FallbackEditorProps {
  code: string
  onChange: (val: string) => void
  fontSize: number
}

function FallbackEditor({ code, onChange, fontSize }: FallbackEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const lineCount = Math.max(1, code.split("\n").length)
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)
  const lineHeight = Math.round(fontSize * 1.5)

  const handleScroll = () => {
    if (textareaRef.current && linesRef.current) {
      linesRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key to insert indentation instead of moving focus
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const val = textarea.value

      // Insert 2 spaces for tab indent
      const newValue = val.substring(0, start) + "  " + val.substring(end)
      onChange(newValue)

      // Reset cursor selection to correct index
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="absolute inset-0 flex bg-[#0c0c0c] text-white font-mono text-sm overflow-hidden select-text" data-lenis-prevent>
      {/* Line Numbers Sidebar */}
      <div 
        ref={linesRef}
        className="w-12 bg-[#080808] text-gray-650 text-right pr-2.5 select-none py-3 border-r border-gray-850 overflow-hidden flex-shrink-0"
        style={{ 
          scrollbarWidth: "none",
          fontSize: `${Math.max(9, fontSize - 2)}px`
        }}
      >
        {lineNumbers.map((num) => (
          <div 
            key={num} 
            className="font-bold opacity-45"
            style={{
              height: `${lineHeight}px`,
              lineHeight: `${lineHeight}px`
            }}
          >
            {num}
          </div>
        ))}
      </div>
      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        data-lenis-prevent
        className="flex-grow bg-[#0c0c0c] text-gray-300 px-4 py-3 outline-none resize-none overflow-y-auto font-mono h-full"
        placeholder="// Type your Arduino C++ code sketch here..."
        style={{
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          whiteSpace: "pre",
          wordWrap: "normal"
        }}
      />
    </div>
  )
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [monacoLoaded, setMonacoLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [fontSize, setFontSize] = useState(14) // default readable code font size (14px)

  useEffect(() => {
    // Show offline option/auto-fallback if Monaco loading is slow (3 seconds)
    const timer = setTimeout(() => {
      if (!monacoLoaded) {
        setShowFallback(true)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [monacoLoaded])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    setMonacoLoaded(true)
    setShowFallback(false)
    
    // Custom theme configuration for Monaco matching Roboflix cinematic branding
    monaco.editor.defineTheme("roboflix-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A737D", fontStyle: "italic" },
        { token: "keyword", foreground: "FF4554", fontStyle: "bold" },
        { token: "string", foreground: "9ECE6A" },
        { token: "number", foreground: "FF9E64" },
        { token: "type", foreground: "00B4D8" },
        { token: "function", foreground: "73DACA", fontStyle: "bold" }
      ],
      colors: {
        "editor.background": "#0c0c0c",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#141414",
        "editorLineNumber.foreground": "#4A4A4A",
        "editorLineNumber.activeForeground": "#E50914",
        "editor.selectionBackground": "#FF455433"
      }
    })
    
    monaco.editor.setTheme("roboflix-dark")
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0c0c] border-b border-gray-800 relative select-none">
      {/* Editor Ribbon Title */}
      <div className="h-9 border-b border-gray-800 bg-[#0d0d0d] flex items-center px-4 justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${showFallback ? "bg-amber-500 animate-pulse" : "bg-red-650 animate-pulse"}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
            sketch.ino
          </span>
          {showFallback && (
            <span className="text-[8px] tracking-wider text-amber-500 font-extrabold bg-amber-950/40 border border-amber-900/35 px-1.5 py-0.5 rounded font-mono">
              OFFLINE EDITOR
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Text Size setting controller */}
          <div className="flex items-center bg-black/40 border border-white/5 rounded px-2 py-0.5 gap-1.5">
            <span className="text-[8.5px] text-gray-500 font-mono font-bold uppercase">Size:</span>
            <button 
              onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
              className="text-[10px] font-bold text-gray-400 hover:text-white px-1 transition cursor-pointer"
              title="Decrease Text Size"
            >
              A-
            </button>
            <span className="text-[9px] font-extrabold text-red-500 font-mono">{fontSize}px</span>
            <button 
              onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
              className="text-[10px] font-bold text-gray-400 hover:text-white px-1 transition cursor-pointer"
              title="Increase Text Size"
            >
              A+
            </button>
          </div>

          {showFallback ? (
            <button 
              onClick={() => { setShowFallback(false); setMonacoLoaded(false); }}
              className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400 transition underline cursor-pointer pr-1"
            >
              Retry Monaco
            </button>
          ) : (
            !monacoLoaded && (
              <button 
                onClick={() => setShowFallback(true)}
                className="text-[9px] uppercase font-bold text-gray-500 hover:text-gray-300 transition underline cursor-pointer pr-1"
              >
                Use Offline Editor
              </button>
            )
          )}
          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-500">
            C++ (Arduino)
          </span>
        </div>
      </div>

      {/* Editor Mount Area */}
      <div className="flex-grow min-h-[200px] relative">
        {showFallback ? (
          <FallbackEditor code={code} onChange={onChange} fontSize={fontSize} />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: fontSize,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              minimap: { enabled: false },
              lineHeight: Math.round(fontSize * 1.5),
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              automaticLayout: true
            }}
            loading={
              <div className="absolute inset-0 bg-[#0c0c0c] flex items-center justify-center text-xs text-gray-500 font-mono">
                Loading Monaco Editor...
              </div>
            }
          />
        )}
      </div>
    </div>
  )
}
