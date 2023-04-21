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
  await prisma.user.deleteMany({
    where: { email: { contains: "@prisma.io" } },
  });

  await prisma.user.createMany({
    data: users.map((name) => ({
      email: `${name.toLowerCase()}@prisma.io`,
      name,
      image: `https://robohash.org/${name.toLowerCase()}?set=set4`,
    })),
  });

  const admin = (await prisma.user.findFirst({
    where: { email: { contains: "@prisma.io" } },
  })) as User;

  const group = await prisma.group.create({
    data: {
      name: "Group 1",
      description: "Group 1 description",
      admin: { connect: { id: admin.id } },
      users: {
        connect: await prisma.user.findMany({
          where: { email: { contains: "@prisma.io" } },
          select: { id: true },
        }),
      },
      invitations: {
        create: [{}],
      },
    },
    include: {
      invitations: true,
    },
  });

  console.log(
    "\n\n✅ Seeding successful! Here's what the created group data:\n\n"
  );

  console.log(JSON.stringify(group, null, 2));

  if (!group.invitations[0]) {
    throw new Error(
      "No invitation found, something went wrong with seeding 🤔"
    );
  }

  console.log("\n\n🔗 connect with the group by following this link:\n\n");

  console.log(`http://localhost:3000/invitations/${group.invitations[0].id}`);
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
