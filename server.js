const express = require("express");
const cors = require("cors");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
app.use(cors());
app.use(express.json());

let sock;

async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log("✅ WA CONNECTED");
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

        if (result.length > 0) {
            return res.json({ registered: true });
        } else {
            return res.json({ registered: false });
        }

    } catch (err) {
        return res.json({ registered: false, error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("WA BOT RUNNING");
});

app.listen(3000, () => {
    console.log("Server jalan di port 3000");
});
