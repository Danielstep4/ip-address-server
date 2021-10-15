import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (ip: string) => {
  const token = jwt.sign(
    {
      data: ip,
      exp: Date.now() + 2629746000,
    },
    process.env.GET_TOKEN_SECRET
  );
  return token;
};
