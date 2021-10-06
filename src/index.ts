import express from "express";
import jwt from "jsonwebtoken";
// import redis from "redis";
import dotenv from "dotenv";

// Dotenv config init
dotenv.config();
// Express init
const app = express();
// Redis init
// const client = redis.createClient(6379);
// client.on("error", console.error);

const port = process.env.PORT || 8080;

app.get("/getToken", (req, res) => {
  const { ip } = req;
  const token = jwt.sign(
    {
      data: ip,
      exp: Date.now() + 2629746000,
    },
    process.env.GET_TOKEN_SECRET
  );
  res.status(200).json({ token });
});

app.listen(port, () => {
  console.log(`server started at port: ${port}`);
});
