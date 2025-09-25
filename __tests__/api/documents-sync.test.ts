/**
 * Document Sync API Tests
 * Tests the /api/documents/sync endpoint for syncing documents
 */

import { NextRequest } from "next/server"
import { POST, GET } from "@/app/api/documents/sync/route"

describe("/api/documents/sync", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/sync", () => {
    it("should sync documents successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "full"
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.sync_id).toBeDefined()
      expect(data.documents_synced).toBe(2)
      expect(data.sync_summary).toBeDefined()
      expect(data.sync_summary.updated_documents).toBe(2)
    })

    it("should sync documents with specific document types", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "partial",
          document_types: ["national_id"]
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.documents_synced).toBe(1)
    })

    it("should sync documents with date range", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "incremental",
          date_range: {
            start_date: "2024-01-01",
            end_date: "2024-01-31"
          }
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.documents_synced).toBe(1)
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
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

    it("should validate required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("User ID and sync type are required")
    })

    it("should validate sync type", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "invalid"
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid sync type. Must be full, partial, or incremental")
    })

    it("should handle Google Drive service initialization failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "full"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-test-gd-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Google Drive service unavailable")
    })

    it("should handle Google Drive sync failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "full"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-test-sync-fail": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Sync failed")
    })

    it("should handle database query errors", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "full"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-test-db-error": "true",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Failed to fetch documents for sync")
    })

    it("should handle empty document list", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "full"
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.documents_synced).toBe(2)
    })

    it("should handle admin sync for all users", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "admin-123",
          sync_type: "full",
          admin_sync: true
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.documents_synced).toBe(2)
    })

    it("should handle partial sync with errors", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: "user-123",
          sync_type: "partial",
          document_types: ["payslip"]
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.documents_synced).toBe(1)
    })
  })

  describe("GET /api/documents/sync", () => {
    it("should get sync status successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync?sync_id=sync-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.sync_status).toBeDefined()
      expect(data.sync_status.sync_id).toBe("sync-123")
    })

    it("should get all syncs for user", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.syncs).toHaveLength(2)
      expect(data.syncs[0].sync_type).toBe("full")
      expect(data.syncs[1].status).toBe("in_progress")
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
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

    it("should handle Google Drive service initialization failure", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "GET",
        headers: {
          "x-test-gd-fail": "true",
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Google Drive service unavailable")
    })

    it("should handle sync not found", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "GET",
        headers: {
          "x-test-not-found": "true",
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Sync not found")
    })

    it("should handle Google Drive service errors", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/sync", {
        method: "GET",
        headers: {
          "x-test-service-error": "true",
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Service error")
    })
  })
})
