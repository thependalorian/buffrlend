/**
 * Document Restore API Tests
 * Tests the /api/documents/restore endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/restore/route"

describe("/api/documents/restore", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/restore", () => {
    it("should return restore API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Restore API route")
    })
  })

  describe("GET /api/documents/restore", () => {
    it("should return restore API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Restore API route")
    })
  })

  describe("PUT /api/documents/restore", () => {
    it("should return restore API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Restore API route")
    })
  })

  describe("DELETE /api/documents/restore", () => {
    it("should return restore API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Restore API route")
    })
  })
})
