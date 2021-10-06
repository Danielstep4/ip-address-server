import express from "express";
import dotenv from "dotenv";
import { parseIp } from "../utils/ipHelper";
import { getUsers, setUser } from "../utils/usersHelper";

dotenv.config();

/** Checking user ip, and saving in json file. */
export const withUserIp = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const ip = parseIp(req);
  if (!ip) {
    console.log("User Without IP.");
    return res.status(500).send("Server Error!");
  }
  const users = getUsers();
  if (!users[ip]) setUser(ip);
  req.body.ip = ip;
  next();
};
