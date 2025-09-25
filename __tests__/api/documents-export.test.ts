/**
 * Document Export API Tests
 * Tests the /api/documents/export endpoint for exporting documents
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/export/route"

describe("/api/documents/export", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/export", () => {
    it("should return export API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Export API route")
    })
  })

  describe("GET /api/documents/export", () => {
    it("should return export API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Export API route")
    })
  })

  describe("PUT /api/documents/export", () => {
    it("should return export API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Export API route")
    })
  })

  describe("DELETE /api/documents/export", () => {
    it("should return export API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Export API route")
    })
  })
})
