import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing POSTGRES_URL environment variable");
  }
  // pgbouncer (transaction pooling) doesn't support prepared statements.
  return postgres(connectionString, { prepare: false });
}

export const sql = globalThis.__sql ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__sql = sql;
}
