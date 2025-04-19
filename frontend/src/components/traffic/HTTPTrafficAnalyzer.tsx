"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import RequestList from "./RequestList"
import RequestDetails from "./RequestDetails"
import type { HTTPRequest } from "./types"
import StatusBar from "./StatusBar"

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:3000" : ""

const HTTPTrafficAnalyzer: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [requests, setRequests] = useState<HTTPRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<HTTPRequest | null>(null)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
  const [showList, setShowList] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobileView(mobile)
      if (!mobile) setShowList(true)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    const ws = new WebSocket(`${protocol}://${window.location.hostname}:3001`)

    ws.onopen = () => console.log("WebSocket connected")

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      switch (msg.type) {
        case "init":
          setRequests(msg.requests)
          setIsCapturing(msg.capturing)
          break
        case "status":
          setIsCapturing(msg.capturing)
          break
        case "request":
          setRequests((prev) => [msg.request, ...prev.filter((r) => r.id !== msg.request.id)])
          if (selectedRequest?.id === msg.request.id) {
            setSelectedRequest(msg.request)
          }
          break
      }
    }

    ws.onerror = (err) => console.error("WS error", err)

    wsRef.current = ws
    return () => ws.close()
  }, [selectedRequest])

  const startCapture = () =>
    fetch(`${API_BASE}/api/capture/start`, { method: "POST" }).catch((err) => console.error(err))
  const stopCapture = () => fetch(`${API_BASE}/api/capture/stop`, { method: "POST" }).catch((err) => console.error(err))
  const clearRequests = () => {
    fetch(`${API_BASE}/api/requests`, { method: "DELETE" })
      .then(() => setSelectedRequest(null))
      .catch((err) => console.error(err))
  }
  const exportTraffic = () => window.open(`${API_BASE}/api/export`)

  const handleUpdate = (updated: HTTPRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setSelectedRequest(updated)
  }

  const handleRequestSelect = (req: HTTPRequest) => {
    setSelectedRequest(req)
    if (isMobileView) setShowList(false)
  }

  const handleNewRequest = () => {
    const newReq: HTTPRequest = {
      id: Date.now().toString(),
      method: "GET",
      url: "",
      headers: {},
      body: "",
      timestamp: new Date().toISOString(),
    }
    setRequests((prev) => [newReq, ...prev])
    setSelectedRequest(newReq)
    if (isMobileView) setShowList(false)
  }

  return (
    <div className="analyzer-container">
      <header className="analyzer-header">
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
            <line x1="2" y1="20" x2="2" y2="20"></line>
          </svg>
          <h1>HTTP Traffic Analyzer</h1>
        </div>

        <div className="header-actions">
          <button className="primary sm tooltip" data-tooltip="Create new request" onClick={handleNewRequest}>
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="hide-on-mobile">New</span>
          </button>

          {isCapturing ? (
            <button className="danger sm tooltip" data-tooltip="Stop capturing" onClick={stopCapture}>
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
                <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
              </svg>
              <span className="hide-on-mobile">Stop</span>
            </button>
          ) : (
            <button className="primary sm tooltip" data-tooltip="Start capturing" onClick={startCapture}>
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
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span className="hide-on-mobile">Start</span>
            </button>
          )}

          <button className="outline sm tooltip" data-tooltip="Clear all requests" onClick={clearRequests}>
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
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span className="hide-on-mobile">Clear</span>
          </button>

          <button className="outline sm tooltip" data-tooltip="Export traffic" onClick={exportTraffic}>
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="hide-on-mobile">Export</span>
          </button>

          {isMobileView && (
            <button
              className="outline sm tooltip"
              data-tooltip={showList ? "Show details" : "Show list"}
              onClick={() => setShowList(!showList)}
            >
              {showList ? (
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
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="14" x2="23" y2="14"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="14" x2="4" y2="14"></line>
                </svg>
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
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      <div className="analyzer-content">
        {/* Request List */}
        {(!isMobileView || showList) && (
          <div className="request-list-container scrollbar">
            <RequestList requests={requests} selectedRequest={selectedRequest} onRequestSelect={handleRequestSelect} />
          </div>
        )}

        {/* Request Details */}
        {(!isMobileView || !showList) && (
          <div className="request-details-container scrollbar">
            <RequestDetails key={selectedRequest?.id} request={selectedRequest} onSend={handleUpdate} />
          </div>
        )}
      </div>

      <StatusBar requestCount={requests.length} isCapturing={isCapturing} />

      <style jsx>{`
        .analyzer-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--background);
          color: var(--text);
        }

        .analyzer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo h1 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .analyzer-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .request-list-container {
          width: 30%;
          border-right: 1px solid var(--border);
          overflow-y: auto;
        }

        .request-details-container {
          flex: 1;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .request-list-container,
          .request-details-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default HTTPTrafficAnalyzer
