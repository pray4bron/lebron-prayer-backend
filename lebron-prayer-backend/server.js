const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Trust Render's proxy to get real client IPs
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors()); // Enable CORS so frontend can communicate with backend

// ✅ Rate limiter: Allow 1 prayer per user per day (using real IP)
const prayerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1, // 1 request per day per unique IP
  message: { error: "You can only pray once per day. 🙏" },
  keyGenerator: (req) => req.ip, // ✅ Ensure rate limit works per unique user IP
});

let prayerCount = 0; // Store prayer count in memory (resets if server restarts)

// ✅ Endpoint to get the current prayer count
app.get("/prayers", (req, res) => {
  res.json({ count: prayerCount });
});

// ✅ Endpoint to increment prayer count (with rate limiting)
app.post("/pray", prayerLimiter, (req, res) => {
  prayerCount++;
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
