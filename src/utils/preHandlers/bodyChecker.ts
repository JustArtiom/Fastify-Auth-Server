import { FastifyReply, FastifyRequest } from "fastify";

interface BodyCheckerOptions {
    required?: { [key: string]: string | number | any };
    optional?: {
        [key: string]: string | number | any | null | undefined;
    };
}

export default (options: BodyCheckerOptions) => {
    return (
        req: FastifyRequest<{ Body: { [key: string]: any } }>,
        rep: FastifyReply
    ) => {
        const body = req.body || {};
        const errors: string[] = [];

        for (const key in options.required) {
            if (!(key in body)) {
                errors.push(`Value "${key}" is missing from the body`);
                continue;
            }

            const expectedType = options.required[key];
            if (typeof body[key] !== expectedType && expectedType !== "any") {
                errors.push(`${key} must be of type ${expectedType}`);
                continue;
            }
        }

        for (const key in options.optional) {
            if (key in body) {
                const expectedType = options.optional[key];
                if (
                    typeof body[key] !== expectedType &&
                    expectedType !== "any"
                ) {
                    errors.push(`${key} must be of type ${expectedType}`);
                    continue;
                }
            }
        }

        if (errors.length > 0) {
            return rep.code(400).send({ errors });
        }
    };
};
