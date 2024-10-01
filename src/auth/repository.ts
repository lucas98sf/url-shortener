import { db } from "@/config/database";
import { users } from "@/models/user";
import { eq } from "drizzle-orm";

export const authRepository = {
  async createUser(email: string, hashedPassword: string) {
    const [user] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  },
};
