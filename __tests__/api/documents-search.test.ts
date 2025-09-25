/**
 * Document SEARCH API Tests
 * Tests the /api/documents/search endpoint
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/search/route"

describe("/api/documents/search", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/search", () => {
    it("should return search API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Search API route")
    })
  })

  describe("GET /api/documents/search", () => {
    it("should return search API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Search API route")
    })
  })

  describe("PUT /api/documents/search", () => {
    it("should return search API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Search API route")
    })
  })

  describe("DELETE /api/documents/search", () => {
    it("should return search API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Search API route")
    })
  })
})
