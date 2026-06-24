/**
 * Global test setup — mocks for Supabase and Expo modules
 */

// Helper to create a fluent chainable mock that is also a Promise (like Supabase/Postgrest)
const createFluentMock = (resolvedValue = { data: null, error: null }) => {
  const mock: any = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    // Terminal behavior: make it awaitable
    then: jest.fn((resolve) => resolve(resolvedValue)),
    catch: jest.fn().mockReturnThis(),
  };
  
  // Custom helper for tests to change the resolved value easily
  mock._resolveWith = (val: any) => {
    mock.then.mockImplementation((resolve: any) => resolve(val));
    return mock;
  };
  
  return mock;
};

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn(() => createFluentMock()),
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'user-test-123' } } }, error: null }),
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-test-123' } }, error: null }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        updateUser: jest.fn().mockResolvedValue({ error: null }),
        admin: {
          deleteUser: jest.fn().mockResolvedValue({ error: null }),
        },
      },
    },
  };
});

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() }),
  useSegments: () => [],
}));

// Mock Expo Notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationHandler: jest.fn(),
}));

// Mock Auth Store
jest.mock('@/stores/auth', () => ({
  useAuthStore: jest.fn(() => ({
    user: { id: 'user-test-123', email: 'test@meucorre.com' },
    session: { user: { id: 'user-test-123' } },
    initialized: true,
    setSession: jest.fn(),
    setInitialized: jest.fn(),
  })),
}));

// Mock use-notifications
jest.mock('@/hooks/use-notifications', () => ({
  scheduleAppointmentReminder: jest.fn().mockResolvedValue(undefined),
  cancelAppointmentReminder: jest.fn().mockResolvedValue(undefined),
}));
