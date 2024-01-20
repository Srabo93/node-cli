import fs from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

export const getDB = async (): Promise<DB> => {
  const db = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(db);
};

export const saveDB = async (db: DB) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
};

export const insertDB = async (note: Note) => {
  const db = await getDB();
  db.notes.push(note);
  await saveDB(db);
  return note;
};
