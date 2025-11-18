import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.js"
import iotRoutes from "./routes/iot.route.js";
import { MqttService } from "./services/mqtt.service.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

MqttService.init();

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use("/auth", authRoutes);
app.use("/iot", iotRoutes);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
