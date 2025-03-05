const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary prayer count (in-memory, resets when the server restarts)
let prayerCount = 0;

// Route to get the current prayer count
app.get("/prayers", (req, res) => {
    res.json({ count: prayerCount });
});

// Route to increment the prayer count
app.post("/pray", (req, res) => {
    prayerCount++;
    res.json({ success: true, count: prayerCount });
});

// New route to handle "/" to fix "Cannot GET /"
app.get("/", (req, res) => {
    res.send("LeBron Prayer Backend is Running 🙏");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
