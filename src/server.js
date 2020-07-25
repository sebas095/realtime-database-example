import { DbSeed } from "./seeds";
import rethinkdb from "rethinkdb";
import createApplication from "./app";
import { PORT, DB_HOST } from "./config";

rethinkdb
  .connect({ host: DB_HOST })
  .then(async (connection) => {
    await DbSeed(connection);
    const app = await createApplication(connection);

    app.listen(PORT, () => {
      console.log("Realtime database server running");
    });
  })
  .catch(console.log);
