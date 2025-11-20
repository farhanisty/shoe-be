import express from "express";
import authRoutes from "./routes/auth.route.js"
import cardRoutes from "./routes/card.route.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use("/auth", authRoutes);

app.use("/api/card", cardRoutes);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
