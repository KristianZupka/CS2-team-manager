const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ================= HELPER FUNCTIONS ================= */

function loadData() {
    const data = fs.readFileSync("data.json", "utf-8");
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

/* ================= ROUTES ================= */

// GET ALL PLAYERS
app.get("/players", (req, res) => {
    const players = loadData();
    res.json(players);
});

// GET ONE PLAYER
app.get("/player/:id", (req, res) => {
    const players = loadData();
    const player = players.find(p => p.id == req.params.id);

    if (!player) {
        return res.status(404).json({ message: "Hráč nenalezen" });
    }

    res.json(player);
});

// CREATE PLAYER (max 6)
app.post("/players", (req, res) => {
    const players = loadData();

    if (players.length >= 6) {
        return res.status(400).json({ message: "Maximální počet hráčů je 6." });
    }

    const newPlayer = {
        id: Date.now(),
        nickname: req.body.nickname,
        role: req.body.role,
        type: req.body.type, // player nebo coach
        avatar: req.body.avatar || "",
        position: {
            x: 0,
            y: 0
        }
    };

    players.push(newPlayer);
    saveData(players);

    res.json({ message: "Hráč vytvořen", player: newPlayer });
});

// EDIT PLAYER
app.post("/edit/:id", (req, res) => {
    const players = loadData();
    const index = players.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Hráč nenalezen" });
    }

    players[index] = {
        ...players[index],
        nickname: req.body.nickname || players[index].nickname,
        role: req.body.role || players[index].role,
        avatar: req.body.avatar || players[index].avatar,
        position: req.body.position || players[index].position
    };

    saveData(players);

    res.json({ message: "Hráč upraven", player: players[index] });
});

// DELETE PLAYER
app.delete("/delete/:id", (req, res) => {
    let players = loadData();
    players = players.filter(p => p.id != req.params.id);

    saveData(players);

    res.json({ message: "Hráč smazán" });
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});