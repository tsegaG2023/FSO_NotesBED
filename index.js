require("dotenv").config();
const Note = require("./models/notes");
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const notesApp = express();
notesApp.use(express.json());
notesApp.use(express.static("dist"));
notesApp.use(cors());

const unknownrequest = (request, response) => {
  response.status(404);
  response.json({ error: "No such end point" });
};
const errorHandler = (error, request, response, next) => {
  console.log("error handler called");
  if (error.name === "CastError") {
    return response.status(404).send({ error: error.message });
  } else if (error.name === "ValidationError") {
    return response.status(404).send({ error: error.message });
  }
  next(error);
};
let notes = [
  {
    id: 1,
    content: "Default",
    important: false,
  },
];

// let notes = [
//   {
//     id: 1,
//     content: "part 0",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "part 1",
//     important: true,
//   },
//   {
//     id: 3,
//     content: "part 2",
//     important: true,
//   },
//   {
//     id: 4,
//     content: "part 3",
//     important: true,
//   },
// ];
const PORT = process.env.PORT || "8000";
console.log("Port Number", PORT);
notesApp.listen(PORT, () => {
  console.log("listening for connnecton to humble sever");
});
const generateNewId = () => {
  const maxId =
    notes.length > 0
      ? Math.max(
          ...notes.map((note) => {
            return note.id;
          })
        )
      : 0;
  console.log(maxId + 1);
  return maxId + 1;
};

notesApp.get("/", (request, response) => {
  response.send("<h2>Good for you from humble server</h2>");
});

notesApp.get("/api/notes", (request, response) => {
  Note.find({}).then((result) => {
    response.json(result);
  });
});
notesApp.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  // const note = notes.find((note) => String(note.id) === id);
  Note.findById(id)
    .then((note) => {
      console.log(note);
      response.json(note);
    })
    .catch((error) => {
      // response.statusMessage = `The requried note with id: ${id} is not found`;
      // response.status(404).end();
      next(error);
    });
});

notesApp.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  console.log(id);
  response.statusMessage = "Delete successful";
  response.status(204).end();
});

notesApp.post("/api/notes/", (request, response, next) => {
  if (!request.body.content) {
    return response.status(400).json({ error: "no content found" });
  }
  const newNote = new Note({
    id: generateNewId(),
    content: request.body.content,
    Important: Boolean(request.body.Important) || false,
  });
  // notes = notes.concat(newNote);
  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => {
      next(error);
    });
  // response.json(newNote);
});

notesApp.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;
  // console.log(body);
  const id = String(request.params.id);
  console.log("id", id);
  // const found = notes.find((note) => {
  //   return note.id === id;
  // });
  // console.log("Found status", found);
  const newObj = {
    // id: id,
    content: body.content,
    important: Boolean(body.important),
  };

  // if (found) {
  Note.findByIdAndUpdate(id, newObj, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updated) => {
      response.json(updated);
    })
    .catch((error) => {
      next(error);
    });
  // notes = notes
  //   .filter((note) => {
  //     return note.id != id;
  //   })
  //   .concat(newObj);
  // return response.json(newObj);
  // }
  // response.status(404).end();
});

notesApp.use(unknownrequest);
notesApp.use(errorHandler);
