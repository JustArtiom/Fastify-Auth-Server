import { FastifyReply, FastifyRequest } from "fastify";
import bodyChecker from "../../../utils/preHandlers/bodyChecker";
import db from "../../../utils/db";
import dbConCheck from "../../../utils/preHandlers/dbConCheck";
import { generateHash } from "../../../utils/crypt";

export const preHandler = [
    dbConCheck,
    bodyChecker({
        required: {
            email: "string",
            username: "string",
            password: "string",
        },
    }),
];

export const handler = async (
    req: FastifyRequest<{
        Body: { email: string; username: string; password: string };
    }>,
    rep: FastifyReply
) => {
    const { email, username, password } = req.body;
    const errors: string[] = [];

    if (!isValidUsernameFormat(username))
        errors.push("Invalid username format");
    if (!isStrongPassword(password))
        errors.push("Password does not meet complexity requirements");
    if (!isValidEmail(email)) errors.push("Invalid email address");
    if (errors.length) return rep.code(400).send({ errors });

    await db.client
        .query(db.readSQL("queries/user_create.sql"), [
            email,
            username,
            await generateHash(password),
        ])
        .then(() => {
            rep.code(200).send();
        })
        .catch(() => {
            rep.code(400).send({
                errors: [
                    "Account with the same username or email already exists",
                ],
            });
        });
};

function isValidUsernameFormat(username: string): boolean {
    return /^[a-zA-Z0-9.]{3,16}$/.test(username);
}

function isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
    );
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
