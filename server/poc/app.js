const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var cors = require("cors");
const formData = require("express-form-data");

// Set up disk storage system. Field name is based of the field value expected from the form-data,
// which will be myFile for now. Files are stored locally. Will move to services such as aws s3 later.
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
}).single("myFile");

// Helper function for video stream. This will sends chunks of a video at a time instead of all at once
const streamVideo = (req, res, path) => {
  const stat = fs.statSync(path); // Gets info about the file
  const fileSize = stat.size;
  const range = req.headers.range;

  // Some browsers specify a range of the video they want in the
  // initial request. We cater to both types by checking if range was included
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};

const app = express();
app.use(cors());
app.use(formData.parse());
// Generic upload route. Can uplaod images or videos through here. All files are names myFile.jpg (or .mp4).
// We only store one file of a specific type for now (will change later)
app.post("/upload", async (req, res) => {
  console.log(req);
  return res.send("Upload success");
});

// Fetches a file with a specified name. For now, all files will be named 'myFile.(*)' so only request that. Extentsion must be passed for this to work
app.get("/fetch/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = "./public/uploads/" + fileName;
  // Assuming all images are jpg and everything else coming in is a video file. Will make this more robust later
  if (path.extname(fileName) !== ".jpg") {
    streamVideo(req, res, filePath);
  } else {
    res.sendFile(filePath, { root: __dirname });
  }
});

// Test route. Sends a random sample video all at once (not streamed).
app.get("/video", (req, res) => {
  res.sendFile("assets/sample.mp4", { root: __dirname });
});

// Test route. Sends a video via stream
app.get("/sample", (req, res) => {
  console.log("In sample get path");
  const path = "assets/sample.mp4";
  streamVideo(req, res, path);
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
