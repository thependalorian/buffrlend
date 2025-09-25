/**
 * Document Delete API Tests
 * Tests the /api/documents/delete endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/delete/route"

describe("/api/documents/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/delete", () => {
    it("should return delete API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Delete API route")
    })
  })

  describe("GET /api/documents/delete", () => {
    it("should return delete API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Delete API route")
    })
  })

  describe("PUT /api/documents/delete", () => {
    it("should return delete API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Delete API route")
    })
  })

  describe("DELETE /api/documents/delete", () => {
    it("should return delete API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Delete API route")
    })
  })
})
