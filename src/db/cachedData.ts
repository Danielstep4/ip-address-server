import mongoose, { Model, Document } from "mongoose";

const CachedDataSchema = new mongoose.Schema<
  CachedDataDocument,
  CachedDataModel
>({
  ip: { type: String, required: true },
  data: { type: Object },
});

export let CachedData = mongoose.connections[0].readyState
  ? mongoose.model<CachedDataDocument, CachedDataModel>("CachedData")
  : mongoose.model<CachedDataDocument, CachedDataModel>(
      "CachedData",
      CachedDataSchema
    );

// Types
type CachedData = {
  ip: string;
  data: any;
};

interface CachedDataDocument extends CachedData, Document {}

interface CachedDataModel extends Model<CachedDataDocument> {}
