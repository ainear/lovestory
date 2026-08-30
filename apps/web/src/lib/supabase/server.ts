import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_SUPABASE_URL = "https://cgymgtnmuuhxzbjecekp.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneW1ndG5tdXVoeHpiamVjZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODIxNzcsImV4cCI6MjEwMjI1ODE3N30.VE3GuiL4hFDy11_ZDSC7vqzbEw2rDebq-jjBbNO8pA0";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        );
                    } catch {
                        // Called from a Server Component — ignore
                    }
                },
            },
        },
    );
}
