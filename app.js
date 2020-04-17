/* Simple Music Player Using NodeJS */
// Importing Required Files And Packages Here.
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const MusicPlayer = require("./musicplayer");

// Defining Global PORT Constant Here.
const PORT = process.env.PORT || 3000;

//Defining  Utility Functions For Multer Here.
const storage = multer.diskStorage({
  destination: "./public/music-player",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const checkFileType = (file, cb) => {
  const filetypes = /mp3|wma|aac|wac/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: File Format not supported..!");
  }
};
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("musicFile");

// Initializing Express App Here.
const app = express();

// Setting Templating Engine Here.
app.set("view engine", "ejs");
app.set("views", "views");

// Defining Express Middlewares Here.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res, next) => {
  MusicPlayer.fetchAll((songs) => {
    res.render("index", {
      songs: songs,
    });
  });
});
app.post("/upload", (req, res, next) => {
  const title = req.body.songName;
  const musicFile = req.file;

  const musicPath = `music-player/${req.file.filename}`;
  console.log(musicPath);
  const music = new MusicPlayer(title, musicPath);
  music.save(() => {
    console.log("song added..!");
    res.redirect("/");
  });
});
app.post("/delete", (req, res, next) => {
  const id = req.body.id;
  const songPath = req.body.songPath;
  MusicPlayer.deleteById(id,songPath, () => {
    console.log("Song Deleted");
    res.redirect("/");
  });
});

// Adding Event Listener TO app Here.
app.listen(PORT);
