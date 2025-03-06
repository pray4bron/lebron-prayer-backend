const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors());

const PRAYER_FILE = path.join(__dirname, "prayers.json");

// ✅ Load prayer count from file
function loadPrayers() {
  try {
    const data = fs.readFileSync(PRAYER_FILE, "utf8");
    return JSON.parse(data).count || 0;
  } catch (error) {
    console.error("Error reading prayers.json:", error);
    return 0;
  }
}

// ✅ Save prayer count to file
function savePrayers(count) {
  try {
    fs.writeFileSync(PRAYER_FILE, JSON.stringify({ count }), "utf8");
  } catch (error) {
    console.error("Error saving to prayers.json:", error);
  }
}

let prayerCount = loadPrayers();

// ✅ Function to get real client IP
const getClientIP = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.ip;
};

// ✅ Rate limiter: 1 prayer per user per day
const prayerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1,
  message: { error: "You can only pray once per day. 🙏" },
  keyGenerator: (req) => getClientIP(req),
});

// ✅ Endpoint to get the current prayer count
app.get("/prayers", (req, res) => {
  res.json({ count: prayerCount });
});

// ✅ Endpoint to increment prayer count
app.post("/pray", prayerLimiter, (req, res) => {
  prayerCount++;
  savePrayers(prayerCount);
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
