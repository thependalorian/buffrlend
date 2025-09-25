/**
 * Document Migration API Tests
 * Tests the /api/documents/migration endpoint for migrating documents
 */

import { NextRequest } from "next/server"
import { POST, GET } from "@/app/api/documents/migration/route"

describe("/api/documents/migration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/migration", () => {
    it("should migrate documents successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/migration", {
        method: "POST",
        body: JSON.stringify({
          source_system: "local",
          target_system: "google_drive",
          migration_type: "full",
          migration_name: "test_migration",
          document_types: ["national_id", "passport"]
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.migration_id).toBeDefined()
      expect(data.documents_migrated).toBe(2)
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/migration", {
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
      const request = new NextRequest("http://localhost:3000/api/documents/migration", {
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
  })

  describe("GET /api/documents/migration", () => {
    it("should get migration status successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/migration?migration_id=migration-123", {
        method: "GET",
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.migration_status).toBeDefined()
    })

    it("should require authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/documents/migration", {
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
  })
})
