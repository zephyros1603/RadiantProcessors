"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const JSONEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const [internalValue, setInternalValue] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)

    try {
      if (newValue.trim()) {
        JSON.parse(newValue)
      }
      setError(null)
      onChange(newValue)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const formatJSON = () => {
    try {
      if (!internalValue.trim()) return
      const parsed = JSON.parse(internalValue)
      const formatted = JSON.stringify(parsed, null, 2)
      setInternalValue(formatted)
      setError(null)
      onChange(formatted)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="json-editor">
      <div className="editor-toolbar">
        <button className="format-button" onClick={formatJSON} disabled={!!error} title="Format JSON">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10H3"></path>
            <path d="M21 6H3"></path>
            <path d="M21 14H3"></path>
            <path d="M21 18H3"></path>
          </svg>
          Format
        </button>
      </div>

      <textarea
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`json-textarea scrollbar ${error ? "has-error" : ""}`}
      />

      {error && (
        <div className="error-message">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <style jsx>{`
        .json-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .editor-toolbar {
          display: flex;
          justify-content: flex-end;
          padding: 8px 16px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .format-button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .format-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .format-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .json-textarea {
          flex: 1;
          width: 100%;
          border: none;
          resize: none;
          padding: 16px;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          background-color: var(--background);
          color: var(--text);
        }

        .json-textarea.has-error {
          border-bottom: 2px solid var(--danger);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}

export default JSONEditor
