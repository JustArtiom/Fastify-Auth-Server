import db from "./utils/db";
import fastify from "fastify";
import config from "./config";

const app = fastify();
app.register(import("./router"));

app.listen(config.fastify).then(() => {
    console.log(
        `REST Api started listening on port http://localhost:${config.fastify.port}`
    );
});

db.client
    .connect()
    .then(() => {
        console.log("Connected to PostgreSQL");
        db.client.query(db.readSQL("queries/tables_init.sql")).catch(() => {
            console.log("Error: Couldnt initialise tables");
        });
    })
    .catch((error) => {
        console.error("Error connecting to PostgreSQL:", error);
    });
