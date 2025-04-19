// src/components/types.ts
export interface HTTPRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  timestamp: string;
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, any>;
    body: string;
    timestamp: string;
    duration?: number;
  };
  error?: boolean;
}
