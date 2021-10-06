import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

import { withToken } from "./middleware/withToken";

// Dotenv config init
dotenv.config();
// Express init
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
const USERS_DB_PATH = path.join(__dirname, "/db/users.json");

app.get("/getToken", (req, res) => {
  let ip = req.socket.remoteAddress.replace(/::ffff:\b/, "");
  const cached = fs.readFileSync(USERS_DB_PATH).toString();
  const db = cached ? JSON.parse(cached) : {};
  if (!db[ip]) {
    fs.writeFileSync(
      USERS_DB_PATH,
      JSON.stringify({
        [ip]: 0,
      })
    );
  }
  const token = jwt.sign(
    {
      data: ip,
      exp: Date.now() + 2629746000,
    },
    process.env.GET_TOKEN_SECRET
  );
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 2629746000),
      httpOnly: true,
    })
    .end();
});

app.post("/getInfo", withToken, async (req, res) => {
  const { ipAddress } = req.body as { token: string; ipAddress?: string };
  if (!ipAddress) res.status(404).send("IP Address is not found");
  try {
    const result = await axios.get(process.env.GEO_URL + ipAddress);
    if (result && result.data) {
      res.status(200).json(result.data);
    } else res.sendStatus(404);
  } catch (e) {
    res.sendStatus(500);
    console.log(e);
  }
});

const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`server started at port: ${port}`);
});
