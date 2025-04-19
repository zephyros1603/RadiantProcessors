"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { HTTPRequest } from "./types"
import JSONEditor from "./JSONEditor"

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:3000" : ""

interface Props {
  request: HTTPRequest | null
  onSend: (updated: HTTPRequest) => void
}

const RequestDetails: React.FC<Props> = ({ request, onSend }) => {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("")
  const [activeTab, setActiveTab] = useState("headers")
  const [headersText, setHeadersText] = useState("{}")
  const [bodyText, setBodyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!request) return
    setMethod(request.method)
    setUrl(request.url)
    setHeadersText(JSON.stringify(request.headers || {}, null, 2))
    setBodyText(request.body || "")
  }, [request])

  const handleSend = async () => {
    if (!request) return

    let headers
    try {
      headers = JSON.parse(headersText)
    } catch (e) {
      alert("Invalid JSON in headers")
      return
    }

    setIsSending(true)

    try {
      const res = await fetch(`${API_BASE}/api/requests/${request.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, url, headers, body: bodyText }),
      })

      if (!res.ok) {
        console.error("HTTP error", await res.text())
        return
      }

      const updated = await res.json()
      onSend(updated)
    } catch (err) {
      console.error("Fetch failed", err)
    } finally {
      setIsSending(false)
    }
  }

  const formatResponseBody = (body: string) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2)
    } catch (e) {
      return body
    }
  }

  const getStatusColor = (status?: number) => {
    if (!status) return "var(--text-secondary)"
    if (status >= 200 && status < 300) return "var(--success)"
    if (status >= 300 && status < 400) return "var(--warning)"
    if (status >= 400) return "var(--danger)"
    return "var(--text-secondary)"
  }

  if (!request) {
    return (
      <div className="empty-state">
        <svg
          viewBox="0 0 24 24"
          width="48"
          height="48"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Select a request from the list</p>
        <p className="hint">or create a new request to get started</p>
      </div>
    )
  }

  return (
    <div className="request-details">
      <div className="request-url-bar">
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="method-select">
          {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          ref={urlInputRef}
          className="url-input"
          value={url}
          placeholder="https://api.example.com"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className={`send-button ${isSending ? "sending" : ""}`} onClick={handleSend} disabled={isSending}>
          {isSending ? (
            <span className="spinner"></span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
          <span>Send</span>
        </button>
      </div>

      <div className="request-content">
        <div className="request-tabs">
          {/* <button className={`tab ${activeTab === "headers" ? "active" : ""}`} onClick={() => setActiveTab("headers")}>
            Headers
          </button>
          <button className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>
            Body
          </button> */}
          <button
            className={`tab ${activeTab === "response" ? "active" : ""}`}
            onClick={() => setActiveTab("response")}
          >
            Response
            {request.response && (
              <span
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(request.response.status) }}
              ></span>
            )}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "headers" && (
            <div className="headers-editor">
              <JSONEditor value={headersText} onChange={setHeadersText} placeholder="Enter request headers as JSON" />
            </div>
          )}

          {activeTab === "body" && (
            <div className="body-editor">
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Enter request body"
                className="body-textarea scrollbar"
              />
            </div>
          )}

          {activeTab === "response" && (
            <div className="response-view scrollbar">
              {request.response ? (
                <div className="response-content">
                  <div className="response-header">
                    <div className="status">
                      <span className="status-code" style={{ color: getStatusColor(request.response.status) }}>
                        {request.response.status}
                      </span>
                      <span className="status-text">{request.response.statusText}</span>
                    </div>
                    {request.response.duration !== undefined && (
                      <div className="duration">
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
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{request.response.duration} ms</span>
                      </div>
                    )}
                  </div>

                  <div className="response-section">
                    <div className="section-title">Headers</div>
                    <pre className="response-headers">{JSON.stringify(request.response.headers, null, 2)}</pre>
                  </div>

                  <div className="response-section">
                    <div className="section-title">Body</div>
                    <pre className="response-body">{formatResponseBody(request.response.body)}</pre>
                  </div>
                </div>
              ) : (
                <div className="no-response">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <p>No response yet</p>
                  <p className="hint">Click "Send" to make the request</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .request-details {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          margin: 4px 0;
        }

        .empty-state .hint {
          font-size: 0.875rem;
          opacity: 0.7;
        }

        .request-url-bar {
          display: flex;
          padding: 16px;
          gap: 8px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .method-select {
          width: 100px;
          flex-shrink: 0;
        }

        .url-input {
          flex: 1;
          min-width: 0;
        }

        .send-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .send-button:hover {
          background-color: var(--primary-dark);
        }

        .send-button.sending {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .request-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .request-tabs {
          display: flex;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .tab {
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          font-size: 0.875rem;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .tab.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .tab-content {
          flex: 1;
          overflow: hidden;
        }

        .headers-editor,
        .body-editor,
        .response-view {
          height: 100%;
          overflow: auto;
        }

        .body-textarea {
          width: 100%;
          height: 100%;
          border: none;
          resize: none;
          padding: 16px;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          background-color: var(--background);
          color: var(--text);
        }

        .response-content {
          padding: 16px;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-code {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status-text {
          color: var(--text-secondary);
        }

        .duration {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .response-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .response-headers,
        .response-body {
          background-color: var(--surface);
          padding: 12px;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }

        .no-response {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
        }

        .no-response svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .no-response p {
          margin: 4px 0;
        }

        .no-response .hint {
          font-size: 0.875rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

export default RequestDetails
