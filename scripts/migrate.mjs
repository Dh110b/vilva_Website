import postgres from "postgres";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Missing POSTGRES_URL_NON_POOLING / POSTGRES_URL env var");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function main() {
  await sql`
    create table if not exists products (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      description text not null,
      price numeric not null,
      images jsonb not null default '[]',
      demo_url text,
      sump_or_bore_capacity text,
      motor_phase_type text,
      motor_type text,
      starter_type text,
      number_of_motors text,
      water_source text,
      number_of_tanks text,
      timer_type text,
      unit_type text,
      created_at timestamptz not null default now()
    );
  `;

  await sql`
    create table if not exists reviews (
      id uuid primary key default gen_random_uuid(),
      product_id text not null,
      name text not null,
      rating int not null,
      description text not null,
      images jsonb not null default '[]',
      created_at timestamptz not null default now()
    );
  `;

  await sql`
    create table if not exists review_replies (
      id uuid primary key default gen_random_uuid(),
      review_id uuid not null references reviews(id) on delete cascade,
      name text not null,
      message text not null,
      is_owner boolean not null default false,
      created_at timestamptz not null default now()
    );
  `;

  await sql`
    create table if not exists enquiries (
      id uuid primary key default gen_random_uuid(),
      product_id text not null,
      product_name text not null,
      name text not null,
      email text not null,
      phone text,
      number_of_tanks text,
      address text not null,
      pincode text not null,
      sump_or_bore_capacity text,
      motor_phase_type text,
      motor_type text,
      starter_type text,
      number_of_motors text,
      water_source text,
      timer_type text,
      unit_type text,
      message text,
      status text not null default 'New',
      created_at timestamptz not null default now()
    );
  `;

  // Generic key-value store for small config blobs: option lists,
  // enquiry form field config, and the current admin OTP.
  await sql`
    create table if not exists app_kv (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    );
  `;

  await sql`
    create table if not exists admin_settings (
      id boolean primary key default true,
      password_hash text not null,
      password_algo text not null default 'scrypt',
      password_updated_at timestamptz not null default now(),
      constraint admin_settings_singleton check (id)
    );
  `;

  await sql`
    create table if not exists admin_login_events (
      id uuid primary key default gen_random_uuid(),
      event_type text not null,
      success boolean not null,
      ip text,
      user_agent text,
      created_at timestamptz not null default now()
    );
  `;
  await sql`
    create index if not exists admin_login_events_created_at_idx
    on admin_login_events (created_at desc);
  `;

  await sql`
    create table if not exists admin_sessions (
      id uuid primary key default gen_random_uuid(),
      token_hash text not null unique,
      created_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now(),
      expires_at timestamptz not null,
      ip text,
      user_agent text,
      revoked_at timestamptz
    );
  `;
  await sql`
    create index if not exists admin_sessions_token_hash_idx
    on admin_sessions (token_hash);
  `;

  // These tables are queried only via the server-side Postgres connection
  // (which connects as the table owner and bypasses RLS). They're also
  // auto-exposed through Supabase's PostgREST API using the public anon
  // key, so RLS must be enabled with no policies to block that public
  // access path entirely.
  for (const table of [
    "products",
    "reviews",
    "review_replies",
    "enquiries",
    "app_kv",
    "admin_settings",
    "admin_login_events",
    "admin_sessions",
  ]) {
    await sql.unsafe(`alter table ${table} enable row level security;`);
  }

  const existingSettings = await sql`select 1 from admin_settings where id = true`;
  if (existingSettings.length === 0) {
    const bootstrapPassword = process.env.ADMIN_PASSWORD || "change-me";
    await sql`
      insert into admin_settings (id, password_hash)
      values (true, ${hashPassword(bootstrapPassword)})
    `;
    console.log("Seeded admin_settings.password_hash from ADMIN_PASSWORD env var.");
  }

  console.log("Migration complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => sql.end());
