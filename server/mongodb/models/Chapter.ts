import mongoose from "mongoose";

const { Schema } = mongoose;

const ChapterSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  chapterPresident: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  patients: {
    type: Number,
    default: 0,
  },
  activeVolunteers: {
    type: Number,
    default: 0,
  },
  inactiveVolunteers: {
    type: Number,
    default: 0,
  },
  yearFounded: {
    type: Number,
    default: new Date().getFullYear(),
  },
  location: {
    type: {
      country: String,
      state: String,
      city: String,
    },
    default: {
      country: "",
      state: "",
      city: "",
    },
  },
});

const Chapter =
  mongoose.models?.Chapter ?? mongoose.model("Chapter", ChapterSchema);
export default Chapter;
