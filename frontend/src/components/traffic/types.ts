export interface HTTPRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  timestamp: string;
  response?: {
    status: number;
    headers: Record<string, string>;
    body: string;
    duration: number;
  };
}