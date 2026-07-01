/**
 * Central API base URL.
 * In production (Render), set NEXT_PUBLIC_API_URL to the backend Render service URL,
 * e.g. https://ai-screening-backend.onrender.com
 * Locally it defaults to http://localhost:3001
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
