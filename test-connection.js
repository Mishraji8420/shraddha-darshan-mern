// Standalone connection tester — bypasses Prisma entirely so we can see
// the REAL underlying error instead of Prisma's generic "P1001" message.
//
// Run with: node test-connection.js
require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function test(label, connectionString) {
  console.log(`\n--- Testing ${label} ---`);
  console.log("(host:", connectionString?.split("@")[1]?.split("/")[0], ")");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS — connected via ${label}!`);
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.log(`❌ FAILED — ${label} — here is the real error:`);
    console.log("  code:   ", err.code);
    console.log("  message:", err.message);
    console.log("  errno:  ", err.errno);
    console.log("  syscall:", err.syscall);
    console.log("  address:", err.address);
    console.log("  port:   ", err.port);
  }
}

(async () => {
  await test("DATABASE_URL (transaction pooler, 6543)", process.env.DATABASE_URL);
  await test("DIRECT_URL (session pooler, 5432)", process.env.DIRECT_URL);
})();
