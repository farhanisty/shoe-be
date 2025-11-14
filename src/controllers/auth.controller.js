import { UserService } from "../services/user.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_KEY = process.env.JWT_KEY;

export const AuthController = {
  async register(req, res) {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "BAD REQUEST" });
      }

      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email sudah digunakan" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserService.createUser({
        email,
        password: hashedPassword,
        name
      });

      return res.status(201).json({
        message: "Register berhasil",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  },
  async login(req, res) {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "Body request tidak ditemukan" });
      }

      if (!("email" in req.body) || !("password" in req.body)) {
        return res.status(400).json({
          error: "Field email dan password wajib ada"
        });
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email dan password tidak boleh kosong" });
      }

      const user = await UserService.findByEmail(email);
      if (!user) return res.status(400).json({ error: "Email atau password salah" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Email atau password salah" });

      const token = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: "1d" });

      res.json({ message: "Login sukses", token });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

