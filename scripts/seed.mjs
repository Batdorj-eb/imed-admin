import bcrypt from "bcryptjs";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

async function seed() {
  const password = await bcrypt.hash("admin123", 10);

  const users = {
    users: [
      {
        id: "1",
        name: "Admin",
        email: "admin@imedtech.mn",
        password,
        role: "admin",
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ],
  };

  writeFileSync(join(dataDir, "users.json"), JSON.stringify(users, null, 2));
  console.log("Seed complete!");
  console.log("Login: admin@imedtech.mn / admin123");
}

seed();
