import mongoose, { Document, Model } from "mongoose";

const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
  ip: { type: String, required: true },
  requests: { type: Number, default: 0 },
  token: { type: String, requied: true },
  created_on: { type: Date, default: Date.now },
});
export let User = mongoose.connections[0].readyState
  ? mongoose.model<UserDocument, UserModel>("User")
  : mongoose.model<UserDocument, UserModel>("User", UserSchema);

// Types
type User = {
  ip: string;
  requests: number;
  token: string;
  created_on?: Date | number;
};

interface UserDocument extends User, Document {}

interface UserModel extends Model<UserDocument> {}
