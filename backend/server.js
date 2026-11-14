import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import todoRoutes from "./routes/todos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/todos", todoRoutes);

// Last-resort error handler: any error passed to next(err) ends up here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// Connect to MongoDB. Mongoose queues queries until the connection is ready.
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err.message));
} else {
  console.warn("MONGODB_URI is not set");
}

// Locally we start a normal server. On Vercel, the platform calls the
// exported app itself, so we must not call listen() there.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

export default app;
