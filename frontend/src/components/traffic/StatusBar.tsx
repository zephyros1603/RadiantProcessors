"use client"

import type React from "react"

interface Props {
  requestCount: number
  isCapturing: boolean
}

const StatusBar: React.FC<Props> = ({ requestCount, isCapturing }) => {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">Requests:</span>
        <span className="status-value">{requestCount}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Status:</span>
        <span className={`status-value ${isCapturing ? "capturing" : "idle"}`}>
          <span className="status-indicator"></span>
          {isCapturing ? "Capturing" : "Idle"}
        </span>
      </div>

      <style jsx>{`
        .status-bar {
          display: flex;
          justify-content: space-between;
          padding: 6px 16px;
          background-color: var(--surface);
          border-top: 1px solid var(--border);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-value {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .idle .status-indicator {
          background-color: var(--text-secondary);
        }

        .capturing .status-indicator {
          background-color: var(--success);
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default StatusBar
