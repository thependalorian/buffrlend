/**
 * Document Download API Tests
 * Tests the /api/documents/download endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/download/route"

describe("/api/documents/download", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/download", () => {
    it("should return download API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Download API route")
    })
  })

  describe("GET /api/documents/download", () => {
    it("should return download API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Download API route")
    })
  })

  describe("PUT /api/documents/download", () => {
    it("should return download API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Download API route")
    })
  })

  describe("DELETE /api/documents/download", () => {
    it("should return download API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Download API route")
    })
  })
})
