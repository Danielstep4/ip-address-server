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
  const { token } = req.body as { token?: string };
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.GET_TOKEN_SECRET);
      if (!payload) res.sendStatus(403);
    } catch (e) {
      console.error(e);
      res.status(403).json({ error: "Invalid Token" });
    }
  } else res.sendStatus(401);
  next();
};
