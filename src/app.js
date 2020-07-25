import http from "http";
import express from "express";
import rethinkdb from "rethinkdb";
import socketIO from "socket.io";
import { join } from "path";
import { DB_NAME, DB_TABLE_NAME } from "./config";

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const views = join(__dirname, "views");

export default async (connection) => {
  app.get("/", (req, res) => res.sendFile(views + "/index.html"));

  // database selection
  const db = rethinkdb.db(DB_NAME);
  // tabla selection
  const commentsTable = db.table(DB_TABLE_NAME);
  // onchange event
  const cursor = await commentsTable.changes().run(connection);

  const getComments = () =>
    new Promise(async (resolve, reject) => {
      const comments = [];
      const _cursor = await commentsTable.run(connection);

      _cursor.each(
        (err, message) => {
          if (err) {
            reject(err);
          }

          comments.push(message);
        },
        (err) => {
          if (err) {
            reject(err);
          }

          resolve(comments);
        }
      );
    });

  cursor.each(async (err, data) => {
    // data.new_val -> new_value
    // data.old_val -> old_value

    const comments = await getComments();
    io.sockets.emit("comments", comments);
  });

  io.on("connection", async (client) => {
    const comments = await getComments();
    client.emit("comments", comments);

    client.on("comments", (body) => {
      const { name, message } = body;

      commentsTable
        .insert({
          name,
          message,
          date: new Date(),
        })
        .run(connection);
    });
  });

  return server;
};
