// 🔥 FIX WAJIB (biar Railway ga error crypto)
global.crypto = require('crypto').webcrypto;

const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update;

        // 🔥 QR muncul di logs
        if (qr) {
            console.log("🔥 SCAN QR INI:");

            const qrImage = await QRCode.toDataURL(qr);
            console.log(qrImage);
        }

        if (connection === "open") {
            console.log("✅ WHATSAPP CONNECTED");
        }

        if (connection === "close") {
            console.log("❌ DISCONNECTED, RECONNECT...");
            startBot();
        }
    });
}

startBot();
