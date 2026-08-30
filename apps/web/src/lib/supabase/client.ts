import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgymgtnmuuhxzbjecekp.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneW1ndG5tdXVoeHpiamVjZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODIxNzcsImV4cCI6MjEwMjI1ODE3N30.VE3GuiL4hFDy11_ZDSC7vqzbEw2rDebq-jjBbNO8pA0";
    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
    );
}
