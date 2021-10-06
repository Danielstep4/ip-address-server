import express from "express";

/** Parsing ip from the request. */
export const parseIp = (req: express.Request): string => {
  let ip: string;
  if (
    req.headers["x-forwarded-for"] &&
    Array.isArray(req.headers["x-forwarded-for"])
  )
    ip = req.headers["x-forwarded-for"].shift();
  else if (req.headers["x-forwarded-for"])
    ip = req.headers["x-forwarded-for"].toString().split(",").shift();
  else ip = req.socket && req.socket.remoteAddress;
  return ip.replace(/::ffff:\b/, "");
};
