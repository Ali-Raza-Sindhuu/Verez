import { prisma } from "./src/config/database.js"; // adjust path

async function seed() {
  const userEmail = "testadmin@example.com"; // the user you just created

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("User not found — create it first via POST /api/users");

  // 1. Role
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Full system access" },
  });

  // 2. Permissions
  const permissionNames = ["users.read", "users.create", "products.read"];
  const permissions = [];
  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    permissions.push(permission);
  }

  // 3. RolePermission — link all permissions to ADMIN
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // 4. Branch
  const branch = await prisma.branch.upsert({
    where: { id: 1 }, // fine for a one-off seed; not relying on name uniqueness
    update: {},
    create: { name: "Branch A", address: "123 Main St" },
  }).catch(async () => {
    // if no branch with id 1 exists yet, just create one
    return prisma.branch.create({ data: { name: "Branch A", address: "123 Main St" } });
  });

  // 5. UserRole — assign ADMIN to our user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  // 6. UserBranch — give user access to Branch A
  await prisma.userBranch.upsert({
    where: {
      userId_branchId: {
        userId: user.id,
        branchId: branch.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      branchId: branch.id,
    },
  });

  console.log("Seed complete.");
  console.log("User ID:", user.id);
  console.log("Branch ID:", branch.id);
  console.log("Role:", adminRole.name);
  console.log("Permissions:", permissions.map(p => p.name));
}

seed()
  .catch((e) => console.error(e))
  .finally(() => process.exit());