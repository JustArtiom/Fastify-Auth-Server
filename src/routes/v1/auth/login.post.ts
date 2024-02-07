import { FastifyReply, FastifyRequest } from "fastify";
import bodyChecker from "../../../utils/preHandlers/bodyChecker";
import db from "../../../utils/db";
import dbConCheck from "../../../utils/preHandlers/dbConCheck";
import { compareHash } from "../../../utils/crypt";
import { User } from "../../../utils/types";
import jwt from "jsonwebtoken";
import config from "../../../config";

export const preHandler = [
    dbConCheck,
    bodyChecker({
        required: {
            password: "string",
        },
        optional: {
            email: "string",
            username: "string",
        },
    }),
];

export const handler = async (
    req: FastifyRequest<{
        Body: { email?: string; username?: string; password: string };
    }>,
    rep: FastifyReply
) => {
    const { email, username, password } = req.body;
    if (!email && !username)
        return rep
            .code(400)
            .send({ errors: ["Email or Username must be present"] });

    const user: User = (
        await db.client.query(db.readSQL("queries/user_get.sql"), [
            username,
            email,
        ])
    )?.rows[0];

    if (!user || !(await compareHash(password, user.password_hash)))
        return rep
            .code(400)
            .send({ errors: ["No account found with these credientials"] });

    const accessToken = jwt.sign({ id: user.id }, config.accessTokenSecret, {
        expiresIn: config.access_expires_in,
    });
    const refreshToken = jwt.sign({ id: user.id }, config.refreshTokenSecret);

    await db.client.query(db.readSQL("queries/jwt_create.sql"), [
        user.id,
        refreshToken,
    ]);

    rep.code(200).send({
        accessToken,
        accessToken_expires_in: config.access_expires_in,
        refreshToken,
    });
};
