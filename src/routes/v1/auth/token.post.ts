import { FastifyReply } from "fastify";
import bodyChecker from "../../../utils/preHandlers/bodyChecker";
import db from "../../../utils/db";
import dbConCheck from "../../../utils/preHandlers/dbConCheck";
import { AuthentificatedFastifyRequest } from "../../../utils/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../../config";

export const preHandler = [
    dbConCheck,
    bodyChecker({
        required: {
            token: "string",
        },
    }),
];

export const handler = async (
    req: AuthentificatedFastifyRequest<{ Body: { token: string } }>,
    rep: FastifyReply
) => {
    const refreshToken = req.body.token;
    const tokenExists = await db.client.query(
        "SELECT COUNT(*) FROM refreshtokens WHERE refresh_token = $1",
        [refreshToken]
    );
    if (!tokenExists.rows[0]?.count)
        return rep
            .code(403)
            .send({ errors: ["This token is not valid or expired."] });

    jwt.verify(refreshToken, config.refreshTokenSecret, (err, data) => {
        if (err)
            return rep
                .code(403)
                .send({ errors: ["This token is not valid or expired."] });

        const accessToken = jwt.sign(
            { id: (data as JwtPayload).id },
            config.accessTokenSecret,
            {
                expiresIn: config.access_expires_in,
            }
        );
        rep.code(200).send({
            accessToken,
            access_expires_in: config.access_expires_in,
        });
    });
};
