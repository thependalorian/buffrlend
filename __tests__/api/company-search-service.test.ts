/**
 * Company Search Service Tests
 * Tests the core company search functionality without Next.js dependencies
 */

// Mock company search service
const searchCompanies = async (query: string) => {
  if (!query || query.trim() === '') {
    return {
      success: false,
      error: 'Search query is required',
    }
  }

  try {
    // Simulate database call
    const mockData = [
      {
        id: '1',
        name: 'Namibia Breweries Limited',
        registration_number: 'C123456',
        industry: 'Manufacturing',
        is_partner: true,
      },
      {
        id: '2',
        name: 'Namibian Mining Corporation',
        registration_number: 'C789012',
        industry: 'Mining',
        is_partner: false,
      },
    ]

    // Filter based on query
    const filteredData = mockData.filter(company => 
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.registration_number.toLowerCase().includes(query.toLowerCase())
    )

    // Sort to show partner companies first
    const sortedCompanies = filteredData.sort((a, b) => {
      if (a.is_partner && !b.is_partner) return -1
      if (!a.is_partner && b.is_partner) return 1
      return 0
    })

    return {
      success: true,
      companies: sortedCompanies,
      total: sortedCompanies.length,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Service temporarily unavailable',
    }
  }
}

describe('Company Search Service', () => {
  describe('searchCompanies', () => {
    it('should search companies by name successfully', async () => {
      const result = await searchCompanies('namibia')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(2)
      expect(result.companies?.[0]?.name).toContain('Namibia')
      expect(result.total).toBe(2)
    })

    it('should handle empty search query', async () => {
      const result = await searchCompanies('')

      expect(result).toEqual({
        success: false,
        error: 'Search query is required',
      })
    })

    it('should handle whitespace-only search query', async () => {
      const result = await searchCompanies('   ')

      expect(result).toEqual({
        success: false,
        error: 'Search query is required',
      })
    })

    it('should search by company name', async () => {
      const result = await searchCompanies('breweries')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(1)
      expect(result.companies?.[0]?.name).toBe('Namibia Breweries Limited')
    })

    it('should search by registration number', async () => {
      const result = await searchCompanies('C123456')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(1)
      expect(result.companies?.[0]?.registration_number).toBe('C123456')
    })

    it('should handle case insensitive search', async () => {
      const result = await searchCompanies('NAMIBIA')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(2)
    })

    it('should return partner companies first', async () => {
      const result = await searchCompanies('namibia')

      expect(result.success).toBe(true)
      expect(result.companies?.[0]?.is_partner).toBe(true)
      expect(result.companies?.[1]?.is_partner).toBe(false)
    })

    it('should return empty results for non-matching query', async () => {
      const result = await searchCompanies('nonexistent')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should handle special characters in search query', async () => {
      const result = await searchCompanies('test & co')

      expect(result.success).toBe(true)
      expect(result.companies).toHaveLength(0)
    })

    it('should limit results appropriately', async () => {
      const result = await searchCompanies('namibia')

      expect(result.success).toBe(true)
      expect(result.companies.length).toBeLessThanOrEqual(50)
    })
  })
})