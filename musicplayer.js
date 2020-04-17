// Importing Required Files And Packages Here.
const path = require("path");
const fs = require("fs");
const FileDeleter = require("./file-deleter");

// Defining Global Constant For Storage Path Here.
const filePath = "music-player.json";

// Utility Function To Fetch The File Data
const getFileData = (cb) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

// Defining MusicPlayer Class Here .
module.exports = class MusicPlayer {
  constructor(title, path) {
    this.title = title;
    this.path = path;
  }
  save(cb) {
    console.log("save");
    getFileData((songs) => {
      const songsCopy = [...songs];
      this.id = Math.random().toString();
      songsCopy.push(this);
      console.log(songsCopy);
      fs.writeFile(filePath, JSON.stringify(songsCopy), () => {
        cb();
      });
    });
  }
  static fetchAll(cb) {
    getFileData((songs) => {
      cb(songs);
    });
  }
  static deleteById(id,songPath, cb) {
    getFileData((songs) => {
      const songsCopy = [...songs];
      const updatedsongs = songsCopy.filter((song, idx) => {
        return song.id !== id;
      });
      FileDeleter.deleteFile(songPath);
      fs.writeFile(filePath, JSON.stringify(updatedsongs), () => {
        cb();
      });
    });
  }
};
