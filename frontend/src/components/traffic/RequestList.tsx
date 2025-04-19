"use client"

import type React from "react"
import type { HTTPRequest } from "./types"

interface Props {
  requests: HTTPRequest[]
  selectedRequest: HTTPRequest | null
  onRequestSelect: (req: HTTPRequest) => void
}

const RequestList: React.FC<Props> = ({ requests, selectedRequest, onRequestSelect }) => {
  const getStatusColor = (status?: number) => {
    if (!status) return "var(--text-secondary)"
    if (status >= 200 && status < 300) return "var(--success)"
    if (status >= 300 && status < 400) return "var(--warning)"
    if (status >= 400) return "var(--danger)"
    return "var(--text-secondary)"
  }

  const formatUrl = (url: string) => {
    if (!url) return "<no-url>"
    try {
      const urlObj = new URL(url)
      return urlObj.pathname + urlObj.search
    } catch (e) {
      return url
    }
  }

  return (
    <div className="request-list">
      {requests.length === 0 ? (
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
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <p>No requests captured yet</p>
          <p className="hint">Click "Start" to begin capturing HTTP traffic</p>
        </div>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className={`request-item ${req.id === selectedRequest?.id ? "selected" : ""} ${req.error ? "error" : ""}`}
            onClick={() => onRequestSelect(req)}
          >
            <div className="request-method">
              <span className={`badge ${req.method.toLowerCase()}`}>{req.method}</span>
            </div>
            <div className="request-info">
              <div className="request-url" title={req.url}>
                {formatUrl(req.url)}
              </div>
              <div className="request-meta">
                <span className="request-time">{new Date(req.timestamp).toLocaleTimeString()}</span>
                {req.response && (
                  <span className="request-status" style={{ color: getStatusColor(req.response.status) }}>
                    {req.response.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <style jsx>{`
        .request-list {
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

        .request-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .request-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .request-item.selected {
          background-color: rgba(58, 134, 255, 0.1);
          border-left: 3px solid var(--primary);
        }

        .request-item.error {
          border-left: 3px solid var(--danger);
        }

        .request-method {
          margin-right: 12px;
        }

        .request-info {
          flex: 1;
          min-width: 0;
        }

        .request-url {
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .request-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .request-status {
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default RequestList
