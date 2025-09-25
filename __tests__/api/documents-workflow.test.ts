/**
 * Document Workflow API Tests
 * Tests the /api/documents/workflow endpoint for managing document processing workflows
 */

import { NextRequest } from "next/server"
import { POST, GET, PUT, DELETE } from "@/app/api/documents/workflow/route"

describe("/api/documents/workflow", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/documents/workflow", () => {
    it("should return workflow API route message", async () => {
      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Workflow API route")
    })
  })

  describe("GET /api/documents/workflow", () => {
    it("should return workflow API route message", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Workflow API route")
    })
  })

  describe("PUT /api/documents/workflow", () => {
    it("should return workflow API route message", async () => {
      const response = await PUT()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Workflow API route")
    })
  })

  describe("DELETE /api/documents/workflow", () => {
    it("should return workflow API route message", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Workflow API route")
    })
  })
})
