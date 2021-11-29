//Globals
const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const fs = require("fs");

//Reads from a file and then appends it
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

//Writes to a file
const writeToFile = (location, content) =>
  fs.writeFile(location, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`Data saved to ${location}`)
  );

//Sets PORT
const PORT = process.env.PORT || 3001;

//Express & middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Route for homepage
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index")));

//Route for notes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes")));

//Wildcard route
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index")));


//Route to get note data
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  })
  //res.json(noteData);
  console.info(`Request recieved`);
});

//Route to post note data
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request was received`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json("Note added successfully");
  } else {
    res.error("Error adding note");
  }
});

//Route to delete notes, reads notes upon completion
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request was received`);
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);
      const newNotes = notes.filter((note) => note.id !== noteId);
      writeToFile("./db/db.json", newNotes);
      fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          res.json(JSON.parse(data));
        }
      })
    }
  })
});

//App listening at PORT 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);