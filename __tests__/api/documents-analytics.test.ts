/**
 * Document Analytics API Tests
 * Tests the /api/documents/analytics endpoint for document analytics
 */

import { NextRequest } from "next/server"
import { GET } from "@/app/api/documents/analytics/route"

describe("/api/documents/analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/documents/analytics", () => {
    it("should return document analytics for user", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
      expect(data.analytics.total_documents).toBe(10)
      expect(data.analytics.verified_documents).toBe(8)
    })

    it("should return document analytics by date range", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123&start_date=2024-01-01&end_date=2024-01-31", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
    })

    it("should return document analytics by document type", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123&document_type=national_id", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
    })

    it("should return document analytics by verification status", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123&verification_status=verified", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
    })

    it("should return admin analytics for all documents", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?is_admin=true", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
      expect(data.analytics.total_documents).toBe(100)
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics", {
        method: "GET",
        headers: {
          "x-test-auth-fail": "true",
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Authentication required")
    })

    it("should handle database query errors", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
        headers: {
          "x-test-db-error": "true",
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Database error")
    })

    it("should handle empty analytics data", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics).toBeDefined()
    })

    it("should handle invalid date formats", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123&start_date=invalid-date", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid date format")
    })

    it("should return document type distribution", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics.document_types).toBeDefined()
      expect(data.analytics.document_types.national_id).toBe(3)
    })

    it("should return verification status distribution", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics.verification_status).toBeDefined()
      expect(data.analytics.verification_status.verified).toBe(8)
    })

    it("should return upload trends", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics.upload_trends).toBeDefined()
      expect(data.analytics.upload_trends).toHaveLength(3)
    })

    it("should return file size statistics", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/analytics?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.analytics.file_size_stats).toBeDefined()
      expect(data.analytics.file_size_stats.average_size).toBe(1024000)
    })
  })
})
