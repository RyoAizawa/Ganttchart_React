import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
// CORSミドルウェアを使用して、すべてのオリジンからのリクエストを許可する
// 特定のオリジンからのみアクセスを許可する
const allowedOrigins = ["http://localhost:5173"];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const port = 3001;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "ganttchart_db",
});

app.get("/api/data", (req, res) => {
    const sql = "SELECT * FROM task";
    con.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

app.get("/api/delete/:id", (req, res) => {
    const sql = "DELETE FROM task WHERE id = ?";
    con.query(sql, [req.params.id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
