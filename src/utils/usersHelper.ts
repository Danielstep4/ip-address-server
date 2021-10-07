import fs from "node:fs";
import path from "node:path";

const USERS_DB_PATH = path.join(__dirname, "../", "/db/users.json");

/** Getting all the users from json file. */
export const getUsers = () => {
  const users = fs.readFileSync(USERS_DB_PATH).toString();
  const db = users ? (JSON.parse(users) as { [key: string]: number }) : {};
  return db;
};
/** Setting new user in the json file. */
export const setUser = (ip: string) => {
  const users = getUsers();
  fs.writeFileSync(
    USERS_DB_PATH,
    JSON.stringify({
      ...users,
      [ip]: 0,
    })
  );
};
/** Incrementing request in json file. */
export const incrementUser = (ip: string) => {
  const users = getUsers();
  const counter = users[ip]++;
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users));
  return counter;
};
/** Removing user from json file. */
export const removeUser = (ip: string) => {
  const users = getUsers();
  Reflect.deleteProperty(users, ip);
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users));
};
