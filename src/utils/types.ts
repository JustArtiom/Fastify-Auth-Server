import { FastifyRequest, RouteGenericInterface } from "fastify";

export interface User {
    id: number;
    avatar: null | string;
    email: string;
    username: string;
    password_hash: string;
    created_timestamp: number;
}

export type AuthentificatedFastifyRequest<
    T extends RouteGenericInterface = {}
> = FastifyRequest<T> & {
    user: User;
};
