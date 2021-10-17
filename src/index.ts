import express from "express";
import mongoose from "mongoose";
import "mongodb";
import helmet from "helmet";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { withToken } from "./middleware/withToken";
import { withUserIp } from "./middleware/withUserIp";
import {
  getUserToken,
  incrementUser,
  setUserNewToken,
} from "./utils/usersHelper";
import { cacheIp, extractCachedIp } from "./utils/ipsHelper";

// Dotenv config init
dotenv.config();
// Express init
const app = express();
// Connect to mongodb
const db = mongoose.connection;
db.once("open", () => {
  console.log("We're Connected to DB!");
});
// Global Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// getToken Route
app.get("/getToken", withUserIp, async (req, res) => {
  try {
    const { ip, token } = req.body as { ip: string; token?: string };
    if (!token) {
      const cachedToken = await getUserToken(ip);
      if (cachedToken) return res.status(200).json({ token: cachedToken, ip });
      else {
        const newToken = await setUserNewToken(ip);
        return res.status(200).json({ token: newToken, ip });
      }
    }
    return res.status(200).json({ token, ip });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
// getInfo Route
app.post("/getInfo", withUserIp, withToken, async (req, res) => {
  const { ipAddress } = req.body as { token: string; ipAddress?: string };
  if (!ipAddress) return res.status(404).send("IP Address is not found");
  try {
    const fixedIpAddress = ipAddress.replace(/\b0/g, "");
    const result = await extractCachedIp(fixedIpAddress);
    if (result) return res.status(200).json(result.data);
    const requestsCount = await incrementUser(req.body.ip);
    if (requestsCount < 21) {
      const result = await axios.get(process.env.GEO_URL + fixedIpAddress);
      if (result && result.data) {
        await cacheIp(fixedIpAddress, result.data);
        return res.status(200).json(result.data);
      } else return res.sendStatus(404);
    } else
      return res.status(401).json({ error: "limit exceeded. (20 requests)" });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
// PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (e) {
    console.log(e);
  }

  console.log(`server started at port: ${PORT}`);
});
