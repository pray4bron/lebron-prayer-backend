const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = "./prayerCount.json";

// Load prayer count from file
let prayerCount = 0;
if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    prayerCount = JSON.parse(data).count || 0;
}

// Store users who prayed (to restrict daily prayers)
let userPrayers = {};

// Endpoint to get the current prayer count
app.get("/prayers", (req, res) => {
    res.json({ count: prayerCount });
});

// Endpoint to register a prayer
app.post("/pray", (req, res) => {
    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const today = new Date().toDateString();

    if (userPrayers[userIP] === today) {
        return res.status(403).json({ message: "You can only pray once per day!" });
    }

    prayerCount++;
    userPrayers[userIP] = today;

    // Save prayer count to file
    fs.writeFileSync(FILE_PATH, JSON.stringify({ count: prayerCount }));

    res.json({ message: "Prayer counted!", count: prayerCount });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));