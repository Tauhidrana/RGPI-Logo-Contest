import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv, configured } from "./env.mjs";

loadEnv();
if (!configured()) {
  console.error("Supabase is not configured. Fill .env.local first.");
  process.exit(1);
}
requireEnv("ADMIN_EMAIL", "ADMIN_PASSWORD");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const email = process.env.ADMIN_EMAIL;
if ((email ?? "").trim().toLowerCase() !== "taujidrana00@gmail.com") {
  console.error("❌ Only tauhidrana00@gmail.com is allowed as admin. Set ADMIN_EMAIL accordingly.\n");
  process.exit(1);
}
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME ?? "Admin";

console.log(`\n→ Creating admin: ${email}`);

let userId;
const { data: created, error: createErr } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: fullName, role: "admin" },
});

if (createErr) {
  if (createErr.message.includes("already") || createErr.message.includes("registered")) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users?.find((u) => u.email === email);
    if (!existing) { console.error("Could not find existing user:", createErr.message); process.exit(1); }
    userId = existing.id;
    console.log("  User already exists — updating profile & password.");
    await supabase.auth.admin.updateUserById(userId, { password, user_metadata: { full_name: fullName, role: "admin" } });
  } else {
    console.error("Failed:", createErr.message);
    process.exit(1);
  }
} else {
  userId = created.user.id;
}

const { error: profileErr } = await supabase.from("profiles").upsert({
  id: userId,
  full_name: fullName,
  role: "admin",
  is_active: true,
});

if (profileErr) { console.error("Profile error:", profileErr.message); process.exit(1); }
console.log(`\n✅ Admin ready.\n   Email: ${email}\n   Password: ${password}\n   Sign in at /admin/login\n`);
