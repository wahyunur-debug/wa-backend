from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/cek', methods=['POST'])
def cek():
    data = request.get_json()
    nomor = str(data.get("nomor", ""))

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

@app.route('/')
def home():
    return "Backend Aktif"
