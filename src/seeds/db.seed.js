import rethinkdb from "rethinkdb";
import { DB_NAME, DB_TABLE_NAME } from "../config";

export default async (connection) => {
  try {
    let db = await rethinkdb.dbList().contains(DB_NAME).run(connection);

    if (!db) {
      await rethinkdb.dbCreate(DB_NAME).run(connection);
      db = rethinkdb.db(DB_NAME);
      console.log("Chats database created");
      await db.tableCreate(DB_TABLE_NAME).run(connection);
      console.log("messages table created successfully");
    }
  } catch (err) {
    console.log(err.message);
  }
};
