// ============================================================
// SUPABASE CLIENT - Singleton for client-side usage
// ============================================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Shared browser client - initialize only if env vars are available
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Helper: upload image to Supabase Storage ──────────────
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return null;
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-images";
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `products/${filename}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ── Helper: delete image from Supabase Storage ────────────
export async function deleteProductImage(url: string): Promise<void> {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return;
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-images";
  // Extract path from public URL
  const path = url.split(`/${bucket}/`)[1];
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}

// ── Helper: Admin Sign In ──────────────────────────────────
export async function adminSignIn(email: any, password: any) {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ── Helper: Sign Out ───────────────────────────────────────
export async function adminSignOut() {
  if (!supabase) {
    console.error("Supabase client not initialized");
    localStorage.removeItem("adminAuth");
    return;
  }
  
  await supabase.auth.signOut();
  localStorage.removeItem("adminAuth");
}