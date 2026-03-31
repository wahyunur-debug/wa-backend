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

        # NORMALISASI
        nomor = ''.join(filter(str.isdigit, nomor))

        if nomor.startswith("0"):
            nomor = "62" + nomor[1:]

        if not nomor.startswith("62"):
            return jsonify({"registered": False})

        # 🔥 VALIDASI (INI YANG BENAR)
        res = requests.post(
            "https://api.fonnte.com/validate",
            headers={"Authorization": TOKEN},
            data={"target": nomor}
        )

        result = res.json()

        return jsonify({
            "registered": result.get("registered", False)
        })

    except Exception as e:
        return jsonify({
            "registered": False,
            "error": str(e)
        })

@app.route('/')
def home():
    return "Backend Aktif"
