import { eq } from 'drizzle-orm';
import { cats } from '../../../conf/schema';
import { db } from '../../../conf/db';

export const getAllCats = async () => {
  console.log('getAllCats');
  return await db.select().from(cats);
};

export const getCatById = async (id: number) => {
  const result = await db.select().from(cats).where(eq(cats.id, id));
  return result.length > 0 ? result[0] : null;
};

export const getCatByName = async (name: string) => {
  const result = await db.select().from(cats).where(eq(cats.name, name));
  return result.length > 0 ? result[0] : null;
};

export const createCat = async (name: string, type: string) => {
  const result = await db.insert(cats).values({ name, type }).returning();
  return result[0];
};
