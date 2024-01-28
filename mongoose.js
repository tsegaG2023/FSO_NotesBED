const { default: mongoose, mongo, connection } = require("mongoose");

url =
  "mongodb+srv://tsegaoracle:nptUa9oBIdGrgJhs@dreamtech.hvopm8b.mongodb.net/notesdb?retryWrites=true&w=majority";
mongoose.connect(url);
const NotesSchema = mongoose.Schema({
  content: String,
  important: Boolean,
});
NotesSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});
const NotesModel = mongoose.model("Notes", NotesSchema);

// const newNote = new NotesModel({
//   content: "part 2",
//   important: true,
// });
// newNote.save().then((result) => {
//   console.log("create");
//   mongoose.connection.close();
// });

NotesModel.find({}).then((notes) => {
  console.log(notes);
  mongoose.connection.close();
});
