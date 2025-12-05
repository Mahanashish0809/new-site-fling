// Database setup
1) brew install postgresql@14
2) brew services start postgresql@14
3) Now go into the server and create .env file with the following content.DATABASE_URL="postgresql://postgres:postgres@user.c0fo0cumqafz.us-east-1.rds.amazonaws.com:5432/user"
4) npx prisma generate
5)npx prisma migrate dev --name init_user_schema
6)Next in package.json add this "scripts": {
    "seed": "prisma db seed"
  }
  and create a file seed.js in prisma folder with the following content:
  import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Ashish",
      email: "ashish@example.com",
    },
  });
  console.log("🌱 Database seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

7) npm run seed
8)psql -h user.c0fo0cumqafz.us-east-1.rds.amazonaws.com -U postgres -d user, password:postgres
9)SELECT * FROM "User";