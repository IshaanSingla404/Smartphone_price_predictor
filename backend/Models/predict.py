import pandas as pd
import joblib 

MODEL_PATH = "models/pipeline.pkl" 

pipeline = joblib.load(MODEL_PATH)

def predict_price(user_input):

    input_df = pd.DataFrame([user_input])
    prediction = pipeline.predict(input_df)

    return float(prediction[0])

if __name__ == "__main__":
    sample_phone = {
    "brand_name": "Samsung",
    "ram": 8,
    "os": "Android",
    "storage": 128,
    "battery_capacity": 5000,
    "has_fast_charging": "Yes",
    "has_5g": "Yes",
    "has_nfc": "Yes",
    "has_fingerprint": "Yes",
    "processor_brand": "Snapdragon",
    "num_cores": 8,
    "primary_rear_camera": 50,
    "num_rear_cameras": 3,
    "primary_front_camera": 16,
    "num_front_cameras": 1,
    "display_size": 6.7,
    "display_type": "AMOLED"
    }

    price = predict_price(sample_phone)

    print(f"Predicted Price: ₹{price:,.2f}")