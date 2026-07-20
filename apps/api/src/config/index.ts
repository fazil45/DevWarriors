export const PORT = process.env.PORT || 4000
export const JWT_SECRET = process.env.JWT_SECRET!
export const NOTION_API_KEY = process.env.NOTION_API_KEY!
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
export const COOKIE_SECURE = process.env.NODE_ENV === "production"
export const COOKIE_SAMESITE = process.env.NODE_ENV === "production" ? "none" : "lax" 