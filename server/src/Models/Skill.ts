import mongoose, { Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  logo: string;
}

const skillSchema = new mongoose.Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/736x/c6/c0/d9/c6c0d9b4b1fbd9dc73296a58e2dfa37e.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
