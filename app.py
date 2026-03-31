from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/cek', methods=['POST'])
def cek():
    try:
        data = request.get_json()
        nomor = str(data.get("nomor", "")).strip()

        if nomor.startswith("0"):
            nomor = "62" + nomor[1:]

        # 🔥 KIRIM PESAN TEST (BUKAN VALIDATE)
        res = requests.post(
            "https://api.fonnte.com/send",
            headers={"Authorization": TOKEN},
            data={
                "target": nomor,
                "message": "Test"
            }
        )

        result = res.json()

        # 🔍 DETEKSI BERHASIL / GAGAL
        if result.get("status") == True:
            return jsonify({"registered": True})
        else:
            return jsonify({"registered": False})

    except Exception as e:
        return jsonify({"registered": False, "error": str(e)})

@app.route('/')
def home():
    return "Backend Aktif"
