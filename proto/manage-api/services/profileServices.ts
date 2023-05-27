import { PrismaClient, Users } from "@prisma/client";
import { IQuery } from "../types/IQuery";
import bcrypt from "@node-rs/bcrypt";

const prisma = new PrismaClient();

/**
 * The passwords should be hashed before pushing it into this
 */
export async function createProfile({ name, password, email }: any): IQuery<{
  id: number;
  user_name: string;
}> {
  try {
    let x = await prisma.users.create({
      data: {
        user_name: name,
        password,
        UserDetails: {
          create: {
            email,
            name,
          },
        },
      },
      select: {
        id: true,
        user_name: true,
      },
    });

    return {
      success: true,
      data: x,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getProfile(name: string) {
  try {
    let x = await prisma.users.findUniqueOrThrow({
      where: { user_name: name },
      select: {
        ServicesOwned: true,
        AppsOwned: true,
        user_name: true,
        id: true,
      },
    });

    return {
      success: true,
      data: x,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function checkUserPassword(name: any, password: any) {
  let x = await prisma.users.findUnique({
    where: { user_name: name },
    select: {
      id: true,
      user_name: true,
      password: true,
    },
  });

  if (!x) return { success: false, message: "User not found" };

  let compare = await bcrypt.compare(password, x.password);

  if (!compare) return { success: false, message: "Invalid credentials" };
  else return { success: true, data: { id: x.id, user_name: x.user_name } };
}
