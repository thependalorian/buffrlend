/**
 * Document Audit API Tests
 * Tests the /api/documents/audit endpoint for document audit trails
 */

import { NextRequest } from "next/server"
import { GET } from "@/app/api/documents/audit/route"

describe("/api/documents/audit", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/documents/audit", () => {
    it("should return document audit trail for user", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
      expect(data.audit_trail).toHaveLength(2)
      expect(data.pagination).toBeDefined()
      expect(data.statistics).toBeDefined()
    })

    it("should return document audit trail by document ID", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&document_id=doc-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
      expect(data.audit_trail[0].document_id).toBe("doc-123")
    })

    it("should return document audit trail by action type", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&action_type=view", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
      expect(data.audit_trail[0].action_type).toBe("view")
    })

    it("should return document audit trail by date range", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&start_date=2024-01-01&end_date=2024-01-31", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
    })

    it("should return document audit trail with pagination", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&limit=10&offset=0", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.offset).toBe(0)
    })

    it("should return admin audit trail for all users", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?is_admin=true", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
    })

    it("should return compliance summary", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.statistics).toBeDefined()
      expect(data.statistics.total_actions).toBeDefined()
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit", {
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
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
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

    it("should handle empty audit trail", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.audit_trail).toBeDefined()
    })

    it("should handle invalid date formats", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&start_date=invalid-date", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid date format")
    })

    it("should handle invalid pagination parameters", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123&limit=0", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid pagination parameters")
    })

    it("should return audit statistics", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.statistics).toBeDefined()
      expect(data.statistics.action_types).toBeDefined()
    })

    it("should return user activity summary", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/audit?user_id=user-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.statistics.unique_users).toBeDefined()
      expect(data.statistics.unique_documents).toBeDefined()
    })
  })
})
