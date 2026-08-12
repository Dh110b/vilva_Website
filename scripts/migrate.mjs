import postgres from "postgres";

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

  console.log("Migration complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => sql.end());
