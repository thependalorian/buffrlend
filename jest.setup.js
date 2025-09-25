// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.TWILIO_ACCOUNT_SID = 'test-twilio-sid'
process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token'
process.env.TWILIO_WHATSAPP_NUMBER = 'whatsapp:+1234567890'
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.iam.gserviceaccount.com'
process.env.GOOGLE_PRIVATE_KEY = 'test-private-key'
process.env.GOOGLE_PROJECT_ID = 'test-project'

// Mock fetch globally
global.fetch = jest.fn()

// Mock window.prompt for WhatsApp auth
global.prompt = jest.fn().mockReturnValue('+1234567890')

// Mock window.location for navigation
delete window.location
window.location = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Create a comprehensive Supabase mock
const createMockSupabaseClient = () => {
  // Create a mock that can handle both chaining and direct mocking
  const createChainableMock = () => {
    const mock = {
      // Query builder methods that return this for chaining
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
      
      // Filter methods that return this for chaining
      eq: jest.fn(),
      neq: jest.fn(),
      gt: jest.fn(),
      gte: jest.fn(),
      lt: jest.fn(),
      lte: jest.fn(),
      like: jest.fn(),
      ilike: jest.fn(),
      is: jest.fn(),
      in: jest.fn(),
      contains: jest.fn(),
      containedBy: jest.fn(),
      rangeGt: jest.fn(),
      rangeGte: jest.fn(),
      rangeLt: jest.fn(),
      rangeLte: jest.fn(),
      rangeAdjacent: jest.fn(),
      overlaps: jest.fn(),
      textSearch: jest.fn(),
      match: jest.fn(),
      not: jest.fn(),
      or: jest.fn(),
      filter: jest.fn(),
      
      // Modifier methods that return this for chaining
      order: jest.fn(),
      limit: jest.fn(),
      range: jest.fn(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
      csv: jest.fn(),
      geojson: jest.fn(),
      explain: jest.fn(),
      rollback: jest.fn(),
      returns: jest.fn(),
      
      // Mock methods for testing
      mockResolvedValue: jest.fn().mockResolvedValue({ data: null, error: null }),
      mockResolvedValueOnce: jest.fn().mockResolvedValue({ data: null, error: null }),
      mockRejectedValue: jest.fn().mockRejectedValue(new Error('Mock error')),
      mockRejectedValueOnce: jest.fn().mockRejectedValue(new Error('Mock error')),
      
      // Make it thenable
      then: jest.fn((resolve) => resolve({ data: null, error: null })),
      catch: jest.fn(),
    }

    // Make all methods return this for chaining
    Object.keys(mock).forEach(key => {
      if (typeof mock[key] === 'function' && 
          !key.startsWith('mock') && 
          key !== 'then' && 
          key !== 'catch') {
        mock[key].mockReturnValue(mock)
        
        // Add mock methods to each method for direct mocking
        mock[key].mockResolvedValue = jest.fn().mockResolvedValue({ data: null, error: null })
        mock[key].mockResolvedValueOnce = jest.fn().mockResolvedValue({ data: null, error: null })
        mock[key].mockRejectedValue = jest.fn().mockRejectedValue(new Error('Mock error'))
        mock[key].mockRejectedValueOnce = jest.fn().mockRejectedValue(new Error('Mock error'))
      }
    })

    return mock
  }

  const mockChain = createChainableMock()

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getClaims: jest.fn().mockResolvedValue({ data: { claims: null }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: jest.fn().mockResolvedValue({ data: { provider: null, url: null }, error: null }),
      signInWithOtp: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      resetPasswordForEmail: jest.fn().mockResolvedValue({ data: null, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      refreshSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
    from: jest.fn(() => mockChain),
    rpc: jest.fn(() => mockChain),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: null, error: null }),
        download: jest.fn().mockResolvedValue({ data: null, error: null }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
        list: jest.fn().mockResolvedValue({ data: [], error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/file.pdf' } }),
        createSignedUrl: jest.fn().mockResolvedValue({ data: { signedUrl: 'https://example.com/signed.pdf' }, error: null }),
      })),
      listBuckets: jest.fn().mockResolvedValue({ data: [], error: null }),
      getBucket: jest.fn().mockResolvedValue({ data: null, error: null }),
      createBucket: jest.fn().mockResolvedValue({ data: null, error: null }),
      deleteBucket: jest.fn().mockResolvedValue({ data: null, error: null }),
      emptyBucket: jest.fn().mockResolvedValue({ data: null, error: null }),
    },
    // Add real-time methods
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    })),
    removeChannel: jest.fn(),
    removeAllChannels: jest.fn(),
    getChannels: jest.fn().mockReturnValue([]),
  }
}

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: createMockSupabaseClient,
}))

// Mock Supabase server
jest.mock('@/lib/supabase/server', () => ({
  createClient: createMockSupabaseClient,
}))

// Mock jose library to avoid ES module issues
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setIssuer: jest.fn().mockReturnThis(),
    setAudience: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-jwt-token'),
  })),
  jwtVerify: jest.fn().mockResolvedValue({
    payload: { sub: 'user-123', exp: Date.now() / 1000 + 3600 },
    protectedHeader: { alg: 'HS256' },
  }),
  createSecretKey: jest.fn().mockReturnValue('mock-secret-key'),
  importJWK: jest.fn().mockResolvedValue('mock-jwk-key'),
  exportJWK: jest.fn().mockResolvedValue({ kty: 'oct', k: 'mock-key' }),
}))
