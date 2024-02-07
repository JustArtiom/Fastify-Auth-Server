import { Client, ClientConfig } from "pg";
import config from "../config";
import fs from "node:fs";

class PGmanager {
    constructor() {
        this.createNewClient();
    }

    client!: Client;
    createNewClient = () => {
        this.client = new Client(config.postgresql);
    };
    // @ts-expect-error private class
    isConnected = (): boolean => this.client._connected;
    awaitConnection = () =>
        new Promise<boolean>((rep, rej) => {
            setInterval(() => {
                if (this.isConnected()) rep(true);
            }, 250);
            setTimeout(() => {
                rej("Database connection timeout!");
            }, 10000);
        });

    readSQL = (path: string): string => fs.readFileSync(path).toString();

    account = {
        create: (opts: {
            username: string;
            email: string;
            password: string;
        }) => {},
    };
}

export default new PGmanager();
