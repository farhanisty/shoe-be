import mqtt from "mqtt";
import prisma from "../lib/prisma.js";

const client = mqtt.connect("mqtt://broker.emqx.io");

const TOPIK_PERINTAH = "raksepatu/perintah";
const TOPIK_DATA     = "raksepatu/data";
const TOPIK_KAMERA   = "raksepatu/trigger_kamera";
const TOPIK_NOTIF    = "raksepatu/notifikasi_user";

export const MqttService = {
  init() {
    client.on("connect", () => {
      console.log("MQTT Terhubung");
      client.subscribe(TOPIK_DATA);
    });

    client.on("message", async (topic, message) => {
      if (topic === TOPIK_DATA) {
        await this.handleMessage(message.toString());
      }
    });
  },

async handleMessage(msg) {
  // JIKA SCAN RFID
  if (msg.startsWith("RFID:")) {
    const uid = msg.split(":")[1].trim();

    const card = await prisma.rfidCard.findUnique({
      where: { uid: uid },
    });

    if (card && card.isActive) {
      console.log(`Akses Diterima: ${card.ownerName}`);
      this.sendCommand("BUKA");
      
      await prisma.deviceLog.create({
        data: { event: "BUKA_RFID", detail: `Kartu: ${card.ownerName}` },
      });
    } else {
      console.log("❌ Akses Ditolak");
      this.sendCommand("TOLAK");
    }
  }

  // JIKA ALARM MALING
  if (msg === "ALARM:GERAKAN_LAMA") {
    console.log("ALARM BAHAYA! Mengirim perintah foto ke HP...");
    
    // Simpan Log Bahaya di Database
    await prisma.deviceLog.create({
      data: { 
        event: "ALARM_MALING", 
        detail: "Gerakan mencurigakan durasi lama. Request Foto sent." 
      },
    });
    
    // Perintah HP CCTV untuk ambil foto
    client.publish(TOPIK_KAMERA, "AMBIL_FOTO_SEKARANG"); 
    
    // C. Perintah HP USER untuk notifikasi
    client.publish(TOPIK_NOTIF, "MALING_TERDETEKSI"); 
  }
},

  sendCommand(command) {
    client.publish(TOPIK_PERINTAH, command);
  },
};