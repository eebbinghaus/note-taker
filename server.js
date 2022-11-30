const express = require("express");
const path = require("path");
let data = require("./db/db.json");

const generateUniqueId = require("generate-unique-id");
const fs = require("fs");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(data);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", async (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: generateUniqueId(),
    };

    const userNote = {
      status: "success",
      body: newNote,
    };

    data.push(newNote);

    await fs.writeFileSync("./db/db.json", JSON.stringify(data));
    console.log(data);
    res.status(201).json(data);
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const newSavedArr = [];
  const id = req.params.id;
  for (let i = 0; i < data.length; i++) {
    const currentId = data[i];
    if (currentId.id !== id) {
      newSavedArr.push(currentId);
    }
  }
  data = [...newSavedArr];
  await fs.writeFileSync("./db/db.json", JSON.stringify(newSavedArr));

  console.log(data);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
