import { prisma } from "../../config/database.js";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return user;
};