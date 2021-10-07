import express from "express";
import session from "express-session";
import helmet from "helmet";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { withToken } from "./middleware/withToken";
import { withUserIp } from "./middleware/withUserIp";
import { incrementUser } from "./utils/usersHelper";
import { cacheIp, extractCachedIp } from "./utils/ipsHelper";

// Dotenv config init
dotenv.config();
// Express init
const app = express();
// Global Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
// getToken Route
app.get("/getToken", withUserIp, (req, res) => {
  const { ip } = req.body;
  const token = jwt.sign(
    {
      data: ip,
      exp: Date.now() + 2629746000,
    },
    process.env.GET_TOKEN_SECRET
  );
  return res.status(200).json({ token });
});
// getInfo Route
app.post("/getInfo", withUserIp, withToken, async (req, res) => {
  const { ipAddress } = req.body as { token: string; ipAddress?: string };
  if (!ipAddress) return res.status(404).send("IP Address is not found");
  try {
    const data = extractCachedIp(ipAddress);
    if (data !== null) return res.status(200).json(data);
    const requestsCount = incrementUser(req.body.ip);
    if (requestsCount < 21) {
      const result = await axios.get(process.env.GEO_URL + ipAddress);
      if (result && result.data) {
        cacheIp(ipAddress, result.data);
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

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`);
});
