import { User } from "../db/users";
import { generateToken } from "./tokenHelper";

/** Getting a specific user by ip address from db. */
export const getUser = async (ip: string) => {
  try {
    const users = await User.findOne({ ip }).exec();
    return users;
  } catch (e) {
    console.error("User DB Fail ", e);
  }
};
/**Getting user token - can return undefined */
export const getUserToken = async (ip: string) => {
  try {
    const user = await getUser(ip);
    if (user && user.token) {
      return user.token;
    }
  } catch (e) {
    console.error("DB Error: ", e);
  }
};
/** Setting new user in db. if user exists return undefined else returns new token. */
export const setUser = async (ip: string) => {
  try {
    const user = await getUser(ip);
    if (user) return;
    const token = generateToken(ip);
    const newUser = new User({
      ip,
      token,
    });
    await newUser.save();
    console.log("New user created: ", newUser);
    return token;
  } catch (e) {
    console.error("DB Error: ", e);
  }
};
/** Incrementing request in user doc. */
export const incrementUser = async (ip: string): Promise<number> => {
  try {
    const user = await getUser(ip);
    if (user) {
      user.requests++;
      await user.save();
      return user.requests;
    } else return Promise.resolve(0);
  } catch (e) {
    console.error("DB Error: ", e);
  }
};
/** Setting new token, and reseting requests counter if user exists
 * if user do not exists creating new user
 * @return token
 */
export const setUserNewToken = async (ip: string) => {
  try {
    const user = await getUser(ip);
    if (user) {
      const token = generateToken(ip);
      user.token = token;
      user.requests = 0;
      await user.save();
      console.log("Added new Token to ", user);
      return token;
    } else {
      const token = await setUser(ip);
      return token;
    }
  } catch (e) {
    console.error("DB Error: ", e);
  }
};
/** Removing user from db. */
export const removeUser = async (ip: string) => {
  try {
    const deltedUser = await User.findOneAndDelete({ ip }).exec();
    console.log(deltedUser, " deleted.");
  } catch (e) {
    console.error("DB Error: ", e);
  }
};
