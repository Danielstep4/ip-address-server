import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

/** Checking if token is valid. If it is valid we continue. */
export const withToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { token } = req.cookies as { token?: string };
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.GET_TOKEN_SECRET);
      if (!payload) return res.sendStatus(403);
    } catch (e) {
      console.error(e);
      return res.status(403).json({ error: "Invalid Token" });
    }
  } else return res.sendStatus(401);
  next();
};
