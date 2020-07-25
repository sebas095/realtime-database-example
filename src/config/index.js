import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const { DB_HOST, PORT, DB_NAME, DB_TABLE_NAME } = process.env;
