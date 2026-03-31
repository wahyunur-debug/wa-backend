// ===============================
// 🔥 FIX GLOBAL (ANTI ERROR CRYPTO)
// ===============================
const crypto = require("crypto")
global.crypto = crypto

// ===============================
const fs = require("fs")
const express = require("express")
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

const app = express()
app.use(express.json())

let sock

// ===============================
// 🔥 RESET SESSION BIAR QR MUNCUL
// ===============================
if (fs.existsSync("./session")) {
    fs.rmSync("./session", { recursive: true, force: true })
}

// ===============================
async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    sock = makeWASocket({
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update

        // 🔥 QR FIX (PASTI KELUAR)
        if (qr) {
            console.log("🔥 SCAN QR INI:")
            console.log("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + qr)
        }

        if (connection === "open") {
            console.log("✅ WA CONNECTED")
        }

        if (connection === "close") {
            console.log("❌ WA DISCONNECT, RECONNECT...")
            startWA()
        }
    })
}

startWA()

// ===============================
// 🔥 API CEK NOMOR WA (VALID)
// ===============================
app.post("/cek", async (req, res) => {
    try {
        let nomor = req.body.nomor || ""

        nomor = nomor.replace(/\D/g, "")

        if (nomor.startsWith("0")) {
            nomor = "62" + nomor.slice(1)
        }

        if (!nomor.startsWith("62")) {
            return res.json({ registered: false })
        }

        const jid = nomor + "@s.whatsapp.net"

        const result = await sock.onWhatsApp(jid)

        return res.json({
            registered: result.length > 0
        })

    } catch (e) {
        return res.json({
            registered: false,
            error: e.message
        })
    }
})

// ===============================
app.get("/", (req, res) => {
    res.send("WA Backend Aktif 🚀")
})

// ===============================
app.listen(3000, () => {
    console.log("🚀 SERVER RUNNING")
})
