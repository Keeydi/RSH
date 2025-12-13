import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
// Supabase Anon Key (public key - safe for client-side use)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdGlsanZyYnZua3hra2dzanlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Njc3OTAsImV4cCI6MjA4MTE0Mzc5MH0._a9t0HCmL8qCyok4MLlAOgXWj7i8FDRdkoe5YoPCVII';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name?: string) => {
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      return {data, error: null};
    } catch (error: any) {
      return {data: null, error};
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return {data, error: null};
    } catch (error: any) {
      return {data: null, error};
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) throw error;
      return {error: null};
    } catch (error: any) {
      return {error};
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const {data: {session}, error} = await supabase.auth.getSession();
      if (error) throw error;
      return {session, error: null};
    } catch (error: any) {
      return {session: null, error};
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const {data: {user}, error} = await supabase.auth.getUser();
      if (error) throw error;
      return {user, error: null};
    } catch (error: any) {
      return {user: null, error};
    }
  },

  // Expose supabase client for auth state changes
  supabase,

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'rhs-archaid://reset-password',
      });
      if (error) throw error;
      return {error: null};
    } catch (error: any) {
      return {error};
    }
  },

};

