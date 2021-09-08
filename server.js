const express = require("express");
const path = require("path");
const db = require("./package.json");


const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "/public/index.html"))
});

app.get("/api/notes", (req, res) => {
    res.sendfile(path.join(_dirname, "/public/notes.html"))
});


app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/404.html'))
);

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request was received`)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);