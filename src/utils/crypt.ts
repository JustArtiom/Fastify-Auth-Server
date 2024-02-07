import bcrypt from "bcrypt";
import config from "../config";

export const generateHash = (data: string) =>
    bcrypt.hash(data, config.saltRounds);

export const compareHash = (plaindata: string, hasheddata: string) =>
    bcrypt.compare(plaindata, hasheddata);
