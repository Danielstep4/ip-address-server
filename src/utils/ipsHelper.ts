import express from "express";
import fs from "node:fs";
import path from "node:path";

const IPS_DB_PATH = path.join(__dirname, "../", "/db/cachedips.json");

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
/** Gets all save ip and data */
const getAllIps = () => {
  const ips = fs.readFileSync(IPS_DB_PATH).toString();
  const db = ips ? JSON.parse(ips) : {};
  return db;
};
/** Saves ip */
export const cacheIp = (ip: string, data: any) => {
  const ips = getAllIps();
  fs.writeFileSync(
    IPS_DB_PATH,
    JSON.stringify({
      ...ips,
      [ip]: data,
    })
  );
};
/**Returns ip data or null */
export const extractCachedIp = (ip: string) => {
  const ips = getAllIps();
  return ips[ip] || null;
};
