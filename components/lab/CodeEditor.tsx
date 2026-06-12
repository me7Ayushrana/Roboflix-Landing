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
      <div className="h-9 border-b border-gray-800 bg-[#0d0d0d] flex items-center px-3 justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full ${showFallback ? "bg-amber-500 animate-pulse" : "bg-red-650 animate-pulse"}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono truncate">
            sketch.ino
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Compact Text Size Controller */}
          <div className="flex items-center bg-black/45 border border-white/5 rounded-md px-1.5 py-0.5 gap-1">
            <button 
              onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
              className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded transition cursor-pointer"
              title="Decrease Font Size"
            >
              –
            </button>
            <span className="text-[9px] font-extrabold text-red-500 font-mono px-0.5">{fontSize}px</span>
            <button 
              onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
              className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded transition cursor-pointer"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          {/* Monaco Connection Toggle */}
          {showFallback ? (
            <button 
              onClick={() => { setShowFallback(false); setMonacoLoaded(false); }}
              className="text-[8.5px] uppercase tracking-wider font-extrabold bg-amber-950/30 hover:bg-amber-900/40 text-amber-500 border border-amber-900/30 px-1.5 py-0.5 rounded font-mono transition cursor-pointer"
              title="Click to reload Monaco Editor"
            >
              Offline (Retry)
            </button>
          ) : (
            !monacoLoaded && (
              <button 
                onClick={() => setShowFallback(true)}
                className="text-[8.5px] uppercase tracking-wider font-bold bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5 px-1.5 py-0.5 rounded font-mono transition cursor-pointer"
                title="Switch to offline text editor"
              >
                Use Offline
              </button>
            )
          )}
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
