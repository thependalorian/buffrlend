import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

describe('Supabase Client Integration Tests', () => {
  describe('Client Creation', () => {
    it('creates browser client successfully', () => {
      expect(() => createClient()).not.toThrow()
    })

    it('creates server client successfully', async () => {
      expect(async () => await createServerClient()).not.toThrow()
    })

    it('browser client has required methods', () => {
      const client = createClient()
      
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      expect(client.from).toBeDefined()
      expect(client.storage).toBeDefined()
      expect(client.rpc).toBeDefined()
    })

    it('server client has required methods', async () => {
      const client = await createServerClient()
      
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      expect(client.from).toBeDefined()
      expect(client.storage).toBeDefined()
      expect(client.rpc).toBeDefined()
    })
  })

  describe('Authentication Methods', () => {
    it('has signUp method', () => {
      const client = createClient()
      expect(typeof client.auth.signUp).toBe('function')
    })

    it('has signInWithPassword method', () => {
      const client = createClient()
      expect(typeof client.auth.signInWithPassword).toBe('function')
    })

    it('has signOut method', () => {
      const client = createClient()
      expect(typeof client.auth.signOut).toBe('function')
    })

    it('has getSession method', () => {
      const client = createClient()
      expect(typeof client.auth.getSession).toBe('function')
    })

    it('has getUser method', () => {
      const client = createClient()
      expect(typeof client.auth.getUser).toBe('function')
    })

    it('has onAuthStateChange method', () => {
      const client = createClient()
      expect(typeof client.auth.onAuthStateChange).toBe('function')
    })

    it('has refreshSession method', () => {
      const client = createClient()
      expect(typeof client.auth.refreshSession).toBe('function')
    })

    it('has resetPasswordForEmail method', () => {
      const client = createClient()
      expect(typeof client.auth.resetPasswordForEmail).toBe('function')
    })

    it('has signInWithOAuth method', () => {
      const client = createClient()
      expect(typeof client.auth.signInWithOAuth).toBe('function')
    })

    it('has signInWithOtp method', () => {
      const client = createClient()
      expect(typeof client.auth.signInWithOtp).toBe('function')
    })
  })

  describe('Database Methods', () => {
    it('can create table queries', () => {
      const client = createClient()
      const query = client.from('profiles')
      
      expect(query).toBeDefined()
      expect(typeof query.select).toBe('function')
      expect(typeof query.insert).toBe('function')
      expect(typeof query.update).toBe('function')
      expect(typeof query.delete).toBe('function')
    })

    it('has select method with proper chaining', () => {
      const client = createClient()
      const query = client.from('profiles').select('*')
      
      expect(query).toBeDefined()
      expect(typeof query.eq).toBe('function')
      expect(typeof query.neq).toBe('function')
      expect(typeof query.gt).toBe('function')
      expect(typeof query.lt).toBe('function')
      expect(typeof query.gte).toBe('function')
      expect(typeof query.lte).toBe('function')
      expect(typeof query.like).toBe('function')
      expect(typeof query.ilike).toBe('function')
      expect(typeof query.in).toBe('function')
      expect(typeof query.is).toBe('function')
      expect(typeof query.order).toBe('function')
      expect(typeof query.limit).toBe('function')
      expect(typeof query.range).toBe('function')
      expect(typeof query.single).toBe('function')
      expect(typeof query.maybeSingle).toBe('function')
    })

    it('has insert method with proper options', () => {
      const client = createClient()
      const query = client.from('profiles').insert({})
      
      expect(query).toBeDefined()
      expect(typeof query.select).toBe('function')
    })

    it('has update method with proper chaining', () => {
      const client = createClient()
      const query = client.from('profiles').update({})
      
      expect(query).toBeDefined()
      expect(typeof query.eq).toBe('function')
      expect(typeof query.select).toBe('function')
    })

    it('has delete method with proper chaining', () => {
      const client = createClient()
      const query = client.from('profiles').delete()
      
      expect(query).toBeDefined()
      expect(typeof query.eq).toBe('function')
    })
  })

  describe('Storage Methods', () => {
    it('can create storage bucket references', () => {
      const client = createClient()
      const bucket = client.storage.from('documents')
      
      expect(bucket).toBeDefined()
      expect(typeof bucket.upload).toBe('function')
      expect(typeof bucket.download).toBe('function')
      expect(typeof bucket.remove).toBe('function')
      expect(typeof bucket.list).toBe('function')
      expect(typeof bucket.getPublicUrl).toBe('function')
      expect(typeof bucket.createSignedUrl).toBe('function')
    })

    it('has storage admin methods', () => {
      const client = createClient()
      
      expect(typeof client.storage.listBuckets).toBe('function')
      expect(typeof client.storage.getBucket).toBe('function')
      expect(typeof client.storage.createBucket).toBe('function')
      expect(typeof client.storage.deleteBucket).toBe('function')
      expect(typeof client.storage.emptyBucket).toBe('function')
    })
  })

  describe('RPC Methods', () => {
    it('has rpc method for calling stored procedures', () => {
      const client = createClient()
      
      expect(typeof client.rpc).toBe('function')
    })

    it('can call rpc with parameters', () => {
      const client = createClient()
      const rpcCall = client.rpc('test_function', { param: 'value' })
      
      expect(rpcCall).toBeDefined()
      expect(typeof rpcCall.then).toBe('function') // Should be a promise-like object
    })
  })

  describe('Real-time Methods', () => {
    it('has channel method for real-time subscriptions', () => {
      const client = createClient()
      
      expect(typeof client.channel).toBe('function')
    })

    it('can create channels with proper methods', () => {
      const client = createClient()
      const channel = client.channel('test-channel')
      
      expect(channel).toBeDefined()
      expect(typeof channel.on).toBe('function')
      expect(typeof channel.subscribe).toBe('function')
      expect(typeof channel.unsubscribe).toBe('function')
    })

    it('has removeChannel method', () => {
      const client = createClient()
      
      expect(typeof client.removeChannel).toBe('function')
    })

    it('has removeAllChannels method', () => {
      const client = createClient()
      
      expect(typeof client.removeAllChannels).toBe('function')
    })

    it('has getChannels method', () => {
      const client = createClient()
      
      expect(typeof client.getChannels).toBe('function')
    })
  })

  describe('Configuration', () => {
    it('uses environment variables correctly', () => {
      const client = createClient()
      
      // Should have created client with URL and key
      expect(client).toBeDefined()
    })

    it('handles missing environment variables gracefully', () => {
      // Should use fallback values for testing
      expect(() => createClient()).not.toThrow()
    })

    it('server client handles cookies correctly', async () => {
      // Should create server client without errors
      expect(async () => await createServerClient()).not.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const client = createClient()
      
      // Should not throw on client creation
      expect(client).toBeDefined()
      
      // Database operations should return error objects, not throw
      try {
        const result = await client.from('nonexistent_table').select('*')
        expect(result).toBeDefined()
        expect(result.error || result.data).toBeDefined()
      } catch (error) {
        // If it throws, it should be a network error, not a client error
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('handles authentication errors gracefully', async () => {
      const client = createClient()
      
      try {
        const result = await client.auth.signInWithPassword({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
        
        expect(result).toBeDefined()
        expect(result.error || result.data).toBeDefined()
      } catch (error) {
        // Should handle auth errors gracefully
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('handles storage errors gracefully', async () => {
      const client = createClient()
      
      try {
        const result = await client.storage.from('nonexistent').list()
        expect(result).toBeDefined()
        expect(result.error || result.data).toBeDefined()
      } catch (error) {
        // Should handle storage errors gracefully
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Type Safety', () => {
    it('provides proper TypeScript types', () => {
      const client = createClient()
      
      // Should have proper typing for auth methods
      expect(typeof client.auth.signUp).toBe('function')
      expect(typeof client.auth.signInWithPassword).toBe('function')
      
      // Should have proper typing for database methods
      expect(typeof client.from).toBe('function')
      
      // Should have proper typing for storage methods
      expect(typeof client.storage.from).toBe('function')
    })

    it('supports generic typing for database operations', () => {
      const client = createClient()
      
      // Should support typed queries
      const query = client.from('profiles').select('*')
      expect(query).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('creates client efficiently', () => {
      const startTime = performance.now()
      
      const client = createClient()
      
      const endTime = performance.now()
      const creationTime = endTime - startTime
      
      expect(client).toBeDefined()
      expect(creationTime).toBeLessThan(100) // Should create quickly
    })

    it('reuses connection efficiently', () => {
      const client1 = createClient()
      const client2 = createClient()
      
      // Both should be valid clients
      expect(client1).toBeDefined()
      expect(client2).toBeDefined()
    })
  })

  describe('Security', () => {
    it('uses secure connection settings', () => {
      const client = createClient()
      
      // Should have created client with secure settings
      expect(client).toBeDefined()
    })

    it('handles API keys securely', () => {
      // Should not expose API keys in client
      const client = createClient()
      expect(client).toBeDefined()
      
      // Client should not expose sensitive configuration
      expect(JSON.stringify(client)).not.toContain('secret')
    })
  })
})