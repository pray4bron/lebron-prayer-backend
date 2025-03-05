const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1); // ✅ Trust Render's proxy to get correct client IPs

app.use(express.json());
app.use(cors()); // ✅ Enable CORS for frontend communication

// ✅ Function to get the real IP of the client
const getClientIP = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.ip; // ✅ Get first IP from forwarded list
};

// ✅ Rate limiter: 1 prayer per user per day based on real IP
const prayerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1, // 1 prayer per day per unique IP
  message: { error: "You can only pray once per day. 🙏" },
  keyGenerator: (req) => getClientIP(req), // ✅ Use real client IP for rate limiting
});

let prayerCount = 0; // Stores prayer count in memory (resets if server restarts)

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
