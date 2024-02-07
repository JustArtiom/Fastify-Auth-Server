import { FastifyPluginCallback } from "fastify";
import {
    getFolderRoutes,
    convertToRouteObjects,
} from "./utils/folderRouteHandler";

const Router: FastifyPluginCallback = (app, opts, done) => {
    const folderRoutes = getFolderRoutes("./dist/routes");
    const objectRoutes = convertToRouteObjects(folderRoutes);

    console.log(`Initialising routes:`);
    for (let route of objectRoutes) {
        console.log(`${route.method.toUpperCase()} - ${route.route}`);
        app[route.method](
            route.route,
            {
                preHandler: async (req, res, done) => {
                    for (let handler of route.preHandler || []) {
                        await handler(req, res);
                    }
                    done();
                },
            },
            route.handler
        );
    }

    done();
};

export default Router;
