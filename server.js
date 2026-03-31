const express = require("express");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const app = express();
app.use(express.json());

let sock;

async function startWA() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true // 🔥 QR muncul di log
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔥 SCAN QR INI:");
      console.log(qr);
    }

    if (connection === "close") {
      console.log("❌ Koneksi putus, reconnect...");
      startWA();
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected!");
    }
  });
}

startWA();

app.post("/cek", async (req, res) => {
  try {
    let nomor = req.body.nomor;

    nomor = nomor.replace(/\D/g, "");

    if (nomor.startsWith("0")) {
      nomor = "62" + nomor.slice(1);
    }

    const result = await sock.onWhatsApp(nomor + "@s.whatsapp.net");

    res.json({
      registered: result.length > 0
    });

  } catch (err) {
    console.log(err);
    res.json({ registered: false });
  }
});

app.get("/", (req, res) => {
  res.send("WA Baileys Aktif");
});

app.listen(3000, () => console.log("🚀 Server jalan di port 3000"));
