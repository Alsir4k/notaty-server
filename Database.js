const mongoose = require("mongoose");
const Note = require("./schemas/note");

class Database {
  constructor() {
    // this.url = "mongodb://127.0.0.1:27017/notaty";
    this.url =
      process.env.MONGODB_URL ||
      "mongodb+srv://admin:admin123@cluster0.6u67h.mongodb.net/notaty?retryWrites=true&w=majority&appName=Cluster0";
  }

  connect() {
    mongoose
      .connect(this.url)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.log("Database connection error", error);
      });
  }

  addNote(note) {
    return new Promise((resolve, reject) => {
      note["createdDate"] = new Date();
      note["updatedDate"] = new Date();

      let newNote = new Note(note);
      newNote
        .save()
        .then((doc) => {
          resolve(doc);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getNotes() {
    return new Promise((resolve, reject) => {
      Note.find({})
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getNoteById(id) {
    return new Promise((resolve, reject) => {
      Note.findById(id)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateNote(note) {
    return new Promise((resolve, reject) => {
      note["updatedDate"] = new Date();
      Note.findByIdAndUpdate(note["_id"], note)
        .then((data) => {
          console.log("Data: ", data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      Note.findByIdAndDelete(id)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getNotesByTitle(noteTitle) {
    return new Promise((resolve, reject) => {
      const query = { title: { $regex: new RegExp(noteTitle, "i") } };
      Note.find(query)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

module.exports = Database;
