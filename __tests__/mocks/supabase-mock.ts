/**
 * Comprehensive Supabase Mock for Testing
 * Provides a complete mock implementation of Supabase client methods
 */

export const createMockSupabaseClient = () => {
  const createChainable = () => {
    const chainable = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      and: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      csv: jest.fn().mockReturnThis(),
      geojson: jest.fn().mockReturnThis(),
      explain: jest.fn().mockReturnThis(),
      rollback: jest.fn().mockReturnThis(),
      abort: jest.fn().mockReturnThis(),
    };
    
    // Add mockResolvedValue to each method that returns a promise
    Object.keys(chainable).forEach(key => {
      if (['select', 'insert', 'update', 'delete', 'single', 'maybeSingle'].includes(key)) {
        (chainable as any)[key].mockResolvedValue = jest.fn().mockResolvedValue({
          data: [],
          error: null,
        });
      }
    });
    
    return chainable;
  };

  return {
    auth: {
      getUser: jest.fn(),
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => createChainable()),
    rpc: jest.fn(),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        list: jest.fn(),
        getPublicUrl: jest.fn(),
        createSignedUrl: jest.fn(),
        createSignedUrls: jest.fn(),
      })),
    },
    realtime: {
      channel: jest.fn(() => ({
        on: jest.fn(),
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
      })),
    },
  };
};

export const mockSupabaseClient = createMockSupabaseClient();