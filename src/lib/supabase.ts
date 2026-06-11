import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createClientSupabase } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { InternalError } from "@/errors/InternalError";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new InternalError(
      "Missing public Supabase client environment variables.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...options }),
          );
        } catch {
          console.error(new InternalError("Failed to set cookies."));
        }
      },
    },
  });
}

export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new InternalError(
      "Missing secure admin client environment variables (SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  return createClientSupabase<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
