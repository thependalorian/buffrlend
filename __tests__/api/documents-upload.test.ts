/**
 * Document Upload API Tests
 * Tests the /api/documents/upload endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/upload/route"

describe("/api/documents/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/upload", () => {
    it("should upload document successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/upload", {
        method: "POST",
        body: JSON.stringify({
          userId: "user-123",
          documentType: "national_id",
          file: "base64-encoded-file-data"
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.document_id).toBeDefined()
      expect(data.google_drive_file_id).toBeDefined()
      expect(data.file_name).toBe("test-document.pdf")
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: {
          "x-test-auth-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Authentication required")
    })

    it("should handle Google Drive service failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: {
          "x-test-gd-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Google Drive service unavailable")
    })

    it("should handle upload failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: {
          "x-test-upload-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Upload failed")
    })
  })

  describe("GET /api/documents/upload", () => {
    it("should return upload API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Upload API route")
    })
  })

  describe("PUT /api/documents/upload", () => {
    it("should return upload API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Upload API route")
    })
  })

  describe("DELETE /api/documents/upload", () => {
    it("should return upload API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Upload API route")
    })
  })
})
