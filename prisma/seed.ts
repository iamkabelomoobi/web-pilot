import * as argon2 from "argon2";
import colors from "colors";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma";

const seed = async () => {
  try {
    const usersData = [
      {
        email: "john.doe@web-pilot.com",
        firstName: "John",
        lastName: "Doe",
        password: await argon2.hash("securePassword123"),
        role: Role.ADMIN,
      },
      {
        email: "sarah.doe@web-pilot.com",
        firstName: "Sarah",
        lastName: "Doe",
        password: await argon2.hash("securePassword123"),
        role: Role.MODERATOR,
      },
    ];

    const result = await prisma.user.createMany({
      data: usersData,
      skipDuplicates: true,
    });

    console.log(
      colors.green(`✅ Successfully seeded ${result.count} user(s)!`)
    );
    return { success: true, count: result.count };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(colors.red(`❌ Seeding failed: ${errorMessage}`));
    return { success: false, error: errorMessage };
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seed()
    .then(() => {
      console.log("🌱 Seeding completed!");
      process.exit(0);
    })
    .catch((e) => {
      console.error("🔥 Seeding failed:", e);
      process.exit(1);
    });
}

export default seed;
