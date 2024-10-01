from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
import urllib.parse

app = Flask(__name__)

password = urllib.parse.quote_plus("Laurenzo@3")
uri = f"mongodb+srv://BeefBowl:{password}@beefbowl.zw2kp.mongodb.net/?retryWrites=true&w=majority&appName=BeefBowl"
client = MongoClient(uri)
db = client['chasing_furries_db']
collection = db['reports']

@app.route('/add_report', methods=['POST'])
def add_report():
    report = request.json
    collection.insert_one(report)
    return jsonify({"message": "Report added successfully!"})

@app.route('/get_reports', methods=['GET'])
def get_reports():
    reports = list(collection.find())
    return jsonify(reports)

if __name__ == '__main__':
    app.run(debug=True)
