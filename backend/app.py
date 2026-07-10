from flask import Flask, request, jsonify
from flask_cors import CORS
from models.predict import predict_price
from models.recommend import recommend_phones

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Forge Backend IS RUNNINGGG!!"

@app.route("/predict", methods = ["POST"])
def predict():
    data = request.get_json()
    
    preference = data.pop("preference", "balanced")
    
    predicted_price = predict_price(data)

    recommendations = recommend_phones(
    predicted_price,
    preference
    )

    recommendations = recommendations.to_dict(orient="records")

    return jsonify({
    "predicted_price": round(predicted_price, 2),
    "recommendations": recommendations
    })


import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )