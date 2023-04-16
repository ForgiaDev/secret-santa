// prisma seeds
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  "Alice",
  "Bob",
  "Charlie",
  "Dave",
  "Eve",
  "Ferdie",
  "Grace",
  "Hannah",
  "Ivan",
  "Judy",
  "Karl",
  "Linda",
  "Mike",
  "Nancy",
  "Oscar",
  "Peggy",
  "Quentin",
  "Ruth",
  "Steve",
  "Tina",
  "Ursula",
  "Victor",
  "Wendy",
  "Xavier",
  "Yvonne",
  "Zach",
];

async function main() {
  await prisma.user.createMany({
    data: users.map((name) => ({
      email: `${name.toLowerCase()}@prisma.io`,
      name,
      image: `https://robohash.org/${name.toLowerCase()}?set=set4`,
    })),
    skipDuplicates: true,
  });

  const admin = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      image: "https://robohash.org/alice?set=set4",
    },
  });

  await prisma.group.deleteMany({
    where: { adminId: admin.id },
  });

  const userIds = await prisma.user.findMany({});

  const group = await prisma.group.create({
    data: {
      name: "Group 1",
      description: "Group 1 description",
      admin: { connect: { id: admin.id } },
      users: { connect: userIds.map((user) => ({ id: user.id })) },
      invitations: {
        create: [{}],
      },
    },
    include: {
      invitations: true,
    },
  });

  console.log(JSON.stringify(group, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
