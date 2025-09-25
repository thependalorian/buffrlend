/**
 * Document Verify API Tests
 * Tests the /api/documents/verify endpoint for document verification
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/verify/route"

describe("/api/documents/verify", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/verify", () => {
    it("should verify document successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/verify", {
        method: "POST",
        body: JSON.stringify({
          documentId: "doc-123",
          action: "verify",
          adminNotes: "Document looks good"
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
      expect(data.verification_status).toBe("verify")
      expect(data.message).toBe("Document verification completed successfully")
    })

    it("should reject document successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/verify", {
        method: "POST",
        body: JSON.stringify({
          documentId: "doc-123",
          action: "reject",
          reason: "Poor quality image",
          adminNotes: "Image is too blurry"
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
      expect(data.verification_status).toBe("reject")
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/verify", {
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
      const request = new NextRequest("http://localhost:3000/api/documents/verify", {
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

    it("should handle verification failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/verify", {
        method: "POST",
        headers: {
          "x-test-verify-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Verification failed")
    })
  })

  describe("GET /api/documents/verify", () => {
    it("should return verify API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Verify API route")
    })
  })

  describe("PUT /api/documents/verify", () => {
    it("should return verify API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Verify API route")
    })
  })

  describe("DELETE /api/documents/verify", () => {
    it("should return verify API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Verify API route")
    })
  })
})
