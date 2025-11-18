import { MqttService } from "../services/mqtt.service.js";
import prisma from "../lib/prisma.js";

export const IotController = {
    
  // Upload Bukti Foro
  async uploadEvidence(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Tidak ada file yang diupload" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      console.log("Menerima Foto Bukti:", fileUrl);

      await prisma.deviceLog.create({
        data: {
          event: "BUKTI_CCTV",
          detail: "Foto otomatis dari HP CCTV",
          evidenceUrl: fileUrl,
        },
      });

      res.status(201).json({ message: "Foto berhasil disimpan", url: fileUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal upload foto" });
    }
  },
  
  // Buka Pintu via HP
  async unlockRemote(req, res) {
    try {
      MqttService.sendCommand("BUKA");

      await prisma.deviceLog.create({
        data: { event: "BUKA_REMOTE", detail: "Dibuka via Aplikasi HP" },
      });

      res.json({ message: "Perintah buka pintu dikirim" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal mengirim perintah" });
    }
  },

  // Lihat History Log
  async getLogs(req, res) {
    try {
      const logs = await prisma.deviceLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 20,
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil log" });
    }
  },
  
  // Tambah Kartu Baru
  async registerCard(req, res) {
    try {
      const { uid, name } = req.body;
      const newCard = await prisma.rfidCard.create({
        data: { uid, ownerName: name }
      });
      res.status(201).json({ message: "Kartu berhasil didaftarkan", data: newCard });
    } catch (error) {
      res.status(400).json({ error: "Gagal daftar kartu" });
    }
  }
};