const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const fs = require("fs");
const util = require("util");

const noteData = require("./db/db.json");
const { title } = require("process");

const readFromFile = util.promisify(fs.readFile);

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

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const PORT = process.env.PORT || 3001;

//Express & middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Route for homepage
app.get("/", (req, res) => res.render("/public/index"));

//Route for notes
app.get("/notes", (req, res) => res.render("/public/notes"));

//Route to get note data
app.get("/api/db", (req, res) => {
  res.json(noteData);
  console.info(`Request recieved`);
});

//Route to post note data
app.post("/api/db", (req, res) => {
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

//Route to delete notes
app.delete("/api/db/:id", (req, res) => {
  console.info(`${req.method} request was received`);
  // const noteId = req.params.id;
  // readFromFile(noteData)
  //   .then((data) => JSON.parse(data))
  //   .then((json) => {
  //     const result = json.filter((title) => title.id !== noteId);

  //     writeToFile(noteData, result);

  //     res.json(`Item ${noteId} is deleted`);
  //   });
});

//App listening at PORT 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);