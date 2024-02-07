import { FastifyReply } from "fastify";
import { AuthentificatedFastifyRequest } from "../types";
import jwt from "jsonwebtoken";
import config from "../../config";
import db from "../db";

export default async (req: AuthentificatedFastifyRequest, rep: FastifyReply) =>
    new Promise((contin) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return rep.status(401).send({
                errors: ["Unauthorized: This route requires authentication."],
            });

        jwt.verify(token, config.accessTokenSecret, async (err, data) => {
            const forbiddenmsg = {
                errors: [
                    "Forbidden: You do not have permission to access this resource.",
                ],
            };
            if (err) return rep.status(403).send(forbiddenmsg);
            if (typeof data !== "object" || !("id" in data)) {
                return rep.status(403).send(forbiddenmsg);
            }

            const user = await db.client.query(
                db.readSQL("queries/user_by_id.sql"),
                [data.id]
            );

            if (!user.rows[0]) return rep.status(403).send(forbiddenmsg);

            req.user = user.rows[0];
            contin(null);
        });
    });
