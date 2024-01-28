require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URL;
console.log("connecting to mongodb" + url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MDB");
  })
  .catch((error) => {
    console.log("error connecting to mongo" + error.message);
  });
const NotesSchema = mongoose.Schema({
  content: { type: String, minLength: 15, required: true },
  important: Boolean,
});
module.exports = mongoose.model("Notes", NotesSchema);
