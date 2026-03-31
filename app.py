from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # INI FIX ERROR CORS

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/cek', methods=['POST'])
def cek():
    try:
        data = request.get_json()
        nomor = str(data.get("nomor", "")).strip()

        # FORMAT NOMOR
        if nomor.startswith("0"):
            nomor = "62" + nomor[1:]

        if not nomor.startswith("62"):
            return jsonify({"registered": False})

        res = requests.post(
            "https://api.fonnte.com/validate",
            headers={"Authorization": TOKEN},
            data={"target": nomor}
        )

        return jsonify(res.json())

    except Exception as e:
        return jsonify({"registered": False, "error": str(e)})

@app.route('/')
def home():
    return "Backend Aktif"
