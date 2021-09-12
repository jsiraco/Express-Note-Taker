const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const noteData = require("./db/db.json");

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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => res.render("/public/index"));

app.get("/notes", (req, res) => res.render("/public/notes"));

app.get("/api/db", (req, res) => {
  res.json(noteData);
  console.info(`Request recieved`);
});

app.post("/api/db", (req, res) => {
  console.info(`${req.method} request was received`)

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
    };

    readAndAppend(newNote, "./db/db.json");
    res.json("Note added successfully");
  } else {
    res.error("Error adding note");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);