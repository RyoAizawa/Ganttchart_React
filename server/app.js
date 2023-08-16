import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const mysql = require("mysql2");
const app = express();

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
            console.log("hote");
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
