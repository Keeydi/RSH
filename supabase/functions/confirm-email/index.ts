// Supabase Edge Function to confirm user email after OTP verification
// Deploy this to: supabase/functions/confirm-email/
// Requires Service Role Key

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {userId} = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({error: 'User ID is required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    // Update user's email_confirmed_at using Admin API
    const {data, error} = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({success: true, user: data.user}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
});











