"use client"

import { useState, useEffect, useRef } from "react"
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

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [monacoLoaded, setMonacoLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

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

  // Fallback Native Code Editor (with line numbers and synced scroll)
  const FallbackEditorView = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const linesRef = useRef<HTMLDivElement>(null)
    const lineCount = Math.max(1, code.split("\n").length)
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

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
      <div className="absolute inset-0 flex bg-[#0c0c0c] text-white font-mono text-sm overflow-hidden select-text">
        {/* Line Numbers Sidebar */}
        <div 
          ref={linesRef}
          className="w-10 bg-[#080808] text-gray-650 text-right pr-2.5 select-none py-3 border-r border-gray-850 overflow-hidden flex-shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-5 leading-5 text-[10px] font-bold opacity-40">
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
          className="flex-grow bg-[#0c0c0c] text-gray-300 px-4 py-3 outline-none resize-none overflow-y-auto leading-5 text-xs font-mono h-full"
          placeholder="// Type your Arduino C++ code sketch here..."
          style={{
            fontFamily: "'Fira Code', 'Courier New', monospace",
            whiteSpace: "pre",
            wordWrap: "normal"
          }}
        />
      </div>
    )
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
        
        <div className="flex items-center gap-2">
          {showFallback ? (
            <button 
              onClick={() => { setShowFallback(false); setMonacoLoaded(false); }}
              className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400 transition underline cursor-pointer pr-2"
            >
              Retry Monaco
            </button>
          ) : (
            !monacoLoaded && (
              <button 
                onClick={() => setShowFallback(true)}
                className="text-[9px] uppercase font-bold text-gray-500 hover:text-gray-300 transition underline cursor-pointer pr-2"
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
          <FallbackEditorView />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 13,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              minimap: { enabled: false },
              lineHeight: 20,
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
