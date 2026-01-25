require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/categories", require("./routes/categories"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/wallets", require("./routes/wallets"));

app.get("/api/health", (req, res) => {
    res.json({ message: "Сервер запущен!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Что-то пошло не так!" });
});

db.sequelize
    .sync()
    .then(() => {
        console.log("База данных синхронизрована");
        app.listen(PORT, () => {
            console.log(`Сервер работает по порту ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Ошибка синхронизации базы данных:", err);
    });
