const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for your frontend
app.use(cors({
    origin: "https://pray4bron.github.io" // Allow frontend domain
}));

app.use(express.json());

// Store prayer count in memory (temporary, resets if the server restarts)
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

// Home route to confirm the server is running
app.get("/", (req, res) => {
    res.send("LeBron Prayer Backend is Running 🙏");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
