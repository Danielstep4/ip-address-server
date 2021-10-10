import express from "express";
import { CachedData } from "../db/cachedData";

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
export const getAllIps = async () => {
  try {
    const data = await CachedData.find();
    return data;
  } catch (e) {
    console.log(e);
  }
};
/** Saves ip */
export const cacheIp = async (ip: string, data: any) => {
  const newCachedIp = new CachedData({ ip, data });
  try {
    await newCachedIp.save();
  } catch (e) {
    console.log(e);
  }
};
/**Returns ip data or null */
export const extractCachedIp = async (ip: string) => {
  try {
    const cachedIp = await CachedData.findOne({ ip }).exec();
    return cachedIp;
  } catch (e) {
    console.log(e);
  }
};
