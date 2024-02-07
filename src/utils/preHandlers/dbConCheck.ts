import { FastifyReply, FastifyRequest } from "fastify";
import db from "../db";

export default async (req: FastifyRequest, rep: FastifyReply) => {
    if (!db.isConnected()) {
        db.createNewClient();
        await db.client.connect().catch(() => {});
        if (!db.isConnected())
            return rep.status(503).send({
                error: [
                    "Failed to establish a connection to the database server. Please try again later or contact support if the issue persists.",
                ],
            });
    }
};
