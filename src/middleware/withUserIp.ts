import express from "express";
import dotenv from "dotenv";
import { parseIp } from "../utils/ipsHelper";
import { setUser } from "../utils/usersHelper";

dotenv.config();

/** Checking user ip, and saving in json file. */
export const withUserIp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const ip = parseIp(req);
  if (!ip) {
    console.log("User Without IP.");
    return res.status(500).send("Server Error!");
  }
  try {
    const token = await setUser(ip);
    if (token) {
      req.body.token = token;
    }
    req.body.ip = ip;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).send("Server Error!");
  }
};
