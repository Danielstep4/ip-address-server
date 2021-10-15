import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import { removeUser, setUserNewToken } from "../utils/usersHelper";
import { parseIp } from "../utils/ipsHelper";

dotenv.config();

/** Checking if token is valid. If it is valid we continue. */
export const withToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { token } = req.body as { token?: string };
  if (token) {
    let payload;
    jwt.verify(token, process.env.GET_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          const newToken = await setUserNewToken(parseIp(req));
          if (newToken) payload = jwt.decode(newToken);
          else return res.status(500).json({ error: "Server Error!" });
        }
        console.error(err);
        return res.status(403).json({ error: "Invalid Token" });
      } else payload = decoded;
    });
    if (!payload) return res.sendStatus(403);
  } else return res.sendStatus(401);
  next();
};
