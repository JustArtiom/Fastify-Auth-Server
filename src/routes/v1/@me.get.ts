import { FastifyReply } from "fastify";
import { AuthentificatedFastifyRequest } from "../../utils/types";

import authHandler from "../../utils/preHandlers/authHandler";
import dbConCheck from "../../utils/preHandlers/dbConCheck";

export const preHandler = [dbConCheck, authHandler];

export const handler = async (
    req: AuthentificatedFastifyRequest,
    rep: FastifyReply
) => {
    rep.send(req.user);
};
