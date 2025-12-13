import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;
const isRenderDB = databaseUrl.includes('render.com');
const isExternalDB = databaseUrl.includes('render.com') || 
                     databaseUrl.includes('neon.tech') || 
                     databaseUrl.includes('supabase') ||
                     databaseUrl.includes('elephantsql') ||
                     databaseUrl.includes('amazonaws');

export const pool = new Pool({ 
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl: isExternalDB ? { rejectUnauthorized: false } : undefined
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

pool.on('connect', () => {
  if (isRenderDB) {
    console.log('✅ Connected to Render PostgreSQL');
  } else if (isExternalDB) {
    console.log('✅ Connected to external PostgreSQL');
  } else {
    console.log('✅ Connected to local PostgreSQL');
  }
});

export const db = drizzle(pool, { schema });
