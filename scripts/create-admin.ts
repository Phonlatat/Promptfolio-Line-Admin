import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const username = await prompt("Username: ");
  const password = await prompt("Password: ");
  const displayName = await prompt("Display name (Enter to skip): ");

  const passwordHash = await bcrypt.hash(password, 12);

  await db.adminUser.upsert({
    where: { username },
    update: { passwordHash, displayName: displayName || "Admin" },
    create: { username, passwordHash, displayName: displayName || "Admin" },
  });

  console.log(`✅ Admin user "${username}" created/updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
