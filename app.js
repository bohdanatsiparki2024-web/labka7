const express = require('express');
const app = express();
app.use(express.json());

// Імітація бази даних
let db = {
    books: [{ id: 1, title: "Kobzar", authorId: 1 }],
    authors: [{ id: 1, name: "Taras Shevchenko" }],
    users: [{ id: 1, name: "Ivan Ivanov" }],
    loans: [], // Видача книг
    fines: []  // Штрафи
};

// Маршрути (Endpoints)
app.get('/books', (req, res) => res.json(db.books));
app.get('/authors', (req, res) => res.json(db.authors));
app.get('/users', (req, res) => res.json(db.users));

// Приклад видачі книги
app.post('/loans', (req, res) => {
    const { userId, bookId } = req.body;
    const newLoan = { id: db.loans.length + 1, userId, bookId, date: new Date() };
    db.loans.push(newLoan);
    res.status(201).json(newLoan);
});

// Перевірка штрафів
app.get('/fines/:userId', (req, res) => {
    const userFines = db.fines.filter(f => f.userId === parseInt(req.params.userId));
    res.json(userFines);
});

module.exports = app; // Експортуємо для тестів