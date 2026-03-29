const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

// Підключення до бази
const db = new sqlite3.Database("./library.db", (err) => {
  if (err) console.error("Помилка БД:", err.message);
  else {
    console.log("База library.db підключена!");
    // АВТОМАТИЧНЕ СТВОРЕННЯ ТАБЛИЦЬ
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS books (
                book_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author_id INTEGER,
                genre TEXT,
                year INTEGER
            )`);
      db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT,
                last_name TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                full_name TEXT
            )`);
      console.log("Таблиці готові до роботи.");
    });
  }
});

// --- ТВОЇ ЗАПИТИ ---

// GET - всі книги
app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST - нова книга
app.post("/books", (req, res) => {
  const { title, author_id, genre, year } = req.body;
  db.run(
    "INSERT INTO books (title, author_id, genre, year) VALUES (?, ?, ?, ?)",
    [title, author_id, genre, year],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Book added", id: this.lastID });
    },
  );
});

// PUT - оновити книгу
app.put("/books/:id", (req, res) => {
  const { title, author_id, genre, year } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE books SET title = ?, author_id = ?, genre = ?, year = ? WHERE book_id = ?",
    [title, author_id, genre, year, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Book updated" });
    },
  );
});

// DELETE - видалити книгу
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM books WHERE book_id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Book deleted" });
  });
});

app.listen(3000, () => console.log("Сервер працює: http://localhost:3000"));
