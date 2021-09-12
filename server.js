const express = require("express");
const path = require("path");
const fs = require("fs");

const noteData = require("./db/db.json");

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


const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "/public/index.html"))
});

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