const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1); // ✅ Trust Render's proxy to get correct client IPs

app.use(express.json());
app.use(cors()); // ✅ Enable CORS for frontend communication

const PRAYER_FILE = "./prayers.json"; // ✅ File to store prayer count

// ✅ Load prayer count from file
function loadPrayerCount() {
    try {
        const data = fs.readFileSync(PRAYER_FILE, "utf8");
        return JSON.parse(data).count || 0;
    } catch (error) {
        return 0; // If file doesn't exist, start at 0
    }
}

// ✅ Save prayer count to file
function savePrayerCount(count) {
    fs.writeFileSync(PRAYER_FILE, JSON.stringify({ count }), "utf8");
}

let prayerCount = loadPrayerCount(); // ✅ Load count from file

// ✅ Get client IP correctly
const getClientIP = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    return forwarded ? forwarded.split(",")[0] : req.ip;
};

// ✅ Rate limiter: 1 prayer per user per day
const prayerLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1, // 1 prayer per day per unique IP
    message: { error: "You can only pray once per day. 🙏" },
    keyGenerator: (req) => getClientIP(req),
});

// ✅ Endpoint to get the current prayer count
app.get("/prayers", (req, res) => {
    res.json({ count: prayerCount });
});

// ✅ Endpoint to increment prayer count (with rate limiting)
app.post("/pray", prayerLimiter, (req, res) => {
    prayerCount++; // ✅ Increase count
    savePrayerCount(prayerCount); // ✅ Save to file
    res.json({ count: prayerCount });
});

// ✅ Default route to check if the backend is running
app.get("/", (req, res) => {
    res.send("LeBron Prayer Backend is Running 🙏");
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
