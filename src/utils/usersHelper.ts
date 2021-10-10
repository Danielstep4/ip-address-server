import { User } from "../db/users";

/** Getting all the users from json file. */
export const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (e) {
    console.error("User DB Fail ", e);
  }
};
/** Setting new user in the json file. */
export const setUser = async (ip: string) => {
  const newUser = new User({
    ip,
  });
  try {
    const user = await User.findOne({ ip }).exec();
    if (user) return;
    await newUser.save();
  } catch (e) {
    console.error(e);
  }
};
/** Incrementing request in json file. */
export const incrementUser = async (ip: string): Promise<number> => {
  try {
    const user = await User.findOne({ ip }).exec();
    user.requests++;
    await user.save();
    return user.requests;
  } catch (e) {
    console.log(e);
  }
};
/** Removing user from json file. */
export const removeUser = async (ip: string) => {
  try {
    await User.findByIdAndDelete({ ip }).exec();
    console.log(ip, " deleted.");
  } catch (e) {
    console.log(e);
  }
};
