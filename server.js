const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const records = require("./public/data/records.js");
let bookmarks = require("./public/data/bookmarks.js");

app.use(express.json());

app.use(cors());

app.get("/files", (req, res) => {
  const filePath = __dirname + `/public/data/movies.json`;

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    res.status(200).send(fileContent);
  } else {
    res.status(500).send("No movie exists!");
  }
});

app.delete("/files/:documentId", (req, res) => {
  res.end("Movie Removed successfully");
});

app.delete("/files/:documentId/records/:recordId", (req, res) => {
  res.end("Subtitle Removed successfully");
});

app.get("/files/search", (req, res) => {
  const movieName = req.query.movieName;
  res.end(`Subtitles are being processed for ${movieName}`);
});

app.get("/files/:documentId/records", (req, res) => {
  const documentId = req.params.documentId;
  const subtitles = records.filter((x) => x.documentId === documentId);
  const bookmarksForDocument = bookmarks.filter((x) => x.documentId === documentId);
  subtitles.map((x) => (bookmarksForDocument.some((y) => y.recordId === x.id) ? (x.bookmarked = true) : (x.bookmarked = false)));
  if (subtitles.length !== 0) {
    res.status(200).send(subtitles);
  } else res.status(500).send("No subtitle exists!");
});

app.post("/files/:documentId/records/:recordId/bookmark", (req, res) => {
  const { documentId, recordId } = req.params;
  bookmarks.push({ documentId, recordId });
  res.status(200).send("Bookmark created successfully");
});

app.delete("/files/:documentId/records/:recordId/bookmark", (req, res) => {
  const { documentId, recordId } = req.params;
  bookmarks = bookmarks.filter((x) => x.documentId != documentId || x.recordId != recordId);
  res.status(200).send("Bookmark removed successfully");
});

app.get("/bookmarks", (req, res) => {
  const subtitles =
    records.filter((x) => bookmarks.some((y) => y.documentId == x.documentId && y.recordId == x.id)).map((x) => ({ ...x, bookmarked: true })) ?? [];
  res.status(200).send(subtitles);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("An error occured during your request. Please try again!");
});

app.listen(3001);
