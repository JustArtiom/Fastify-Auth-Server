import path from "node:path";
import fs from "node:fs";
import { FastifyReply, FastifyRequest } from "fastify";

export function getFolderRoutes(baseDir: string, currentDir = ""): string[] {
    const folderRoutes: string[] = [];

    const dirPath = path.join(baseDir, currentDir);
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(currentDir, file.name);

        if (file.isDirectory()) {
            const subfolderRoutes = getFolderRoutes(baseDir, filePath);
            folderRoutes.push(...subfolderRoutes);
        } else {
            folderRoutes.push(filePath);
        }
    }

    return folderRoutes;
}

export function convertToRouteObjects(filePaths: string[]) {
    return filePaths.map((filePath) => {
        const parts = filePath.split(path.sep);
        const route_data = parts.pop()?.split(".") || "";
        const route = "/" + parts.join("/") + "/" + route_data[0];

        const route_func = require(path.resolve(
            __dirname,
            "..",
            "routes",
            filePath
        )) as {
            handler: () => any;
            preHandler?: ((req: FastifyRequest, res: FastifyReply) => any)[];
        };

        return {
            route,
            method: route_data[1] as "post" | "get" | "put" | "delete",
            handler: route_func.handler,
            preHandler: route_func.preHandler,
        };
    });
}
