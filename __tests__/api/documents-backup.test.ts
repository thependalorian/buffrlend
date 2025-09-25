/**
 * Document Backup API Tests
 * Tests the /api/documents/backup endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/backup/route"

describe("/api/documents/backup", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/backup", () => {
    it("should return backup API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Backup API route")
    })
  })

  describe("GET /api/documents/backup", () => {
    it("should return backup API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Backup API route")
    })
  })

  describe("PUT /api/documents/backup", () => {
    it("should return backup API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Backup API route")
    })
  })

  describe("DELETE /api/documents/backup", () => {
    it("should return backup API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Backup API route")
    })
  })
})
