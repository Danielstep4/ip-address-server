import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

dotenv.config();

const USERS_DB_PATH = path.join(__dirname, "/db/users.json");
export const withToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let ip = req.socket.remoteAddress.replace(/::ffff:\b/, "");
  const cached = fs.readFileSync(USERS_DB_PATH).toString();
  const db = cached ? JSON.parse(cached) : {};
  next();
};
