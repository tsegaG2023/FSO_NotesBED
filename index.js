const express = require("express");
const cors = require("cors");
const notesApp = express();
notesApp.use(express.json());
notesApp.use(cors());
let notes = [
  {
    id: 1,
    content: "part 0",
    important: true,
  },
  {
    id: 2,
    content: "part 1",
    important: true,
  },
  {
    id: 3,
    content: "part 2",
    important: true,
  },
];
const PORT = process.env.port || "8000";
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
  response.json(notes);
});
notesApp.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => String(note.id) === id);
  console.log(note);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = `The requried note with id: ${id} is not found`;
    response.status(404).end();
  }
});

notesApp.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  console.log(id);
  response.statusMessage = "Delete successful";
  response.status(204).end();
});

notesApp.post("/api/notes/", (request, response) => {
  if (!request.body.content) {
    return response.status(400).json({ error: "no content found" });
  }
  const newNote = {
    id: generateNewId(),
    content: request.body.content,
    Important: Boolean(request.body.Important) || false,
  };
  notes = notes.concat(newNote);
  response.json(newNote);
});

notesApp.put("/api/notes/:id", (request, response) => {
  const body = request.body;
  console.log(body);
  const id = Number(request.params.id);
  console.log(id);
  const found = notes.find((note) => {
    return note.id === id;
  });
  console.log("Found status", found);
  const newObj = {
    id: id,
    content: body.content,
    important: Boolean(body.important),
  };
  if (found) {
    notes = notes
      .filter((note) => {
        return note.id != id;
      })
      .concat(newObj);
    return response.json(newObj);
  }
  response.status(404).end();
});
