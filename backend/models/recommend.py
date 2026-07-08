import pandas as pd

df = pd.read_csv("Data/data_smartphone.csv")

df["num_core"] = df["num_core"].fillna(df["num_core"].median())


df = df.rename(
    columns = {
    "Name": "phone_name",
    "Price": "price",
    "RAM": "ram",
    "OS": "os",
    "Battery_cap": "battery_capacity",
    "processor_brand": "processor_brand",
    "num_core": "num_cores",
    "primery_rear_camera": "primary_rear_camera",
    "Num_Rear_Cameras": "num_rear_cameras",
    "primery_front_camera": "primary_front_camera",
    "num_front_camera": "num_front_cameras",
    "display_size(inch)": "display_size",
    "display_types": "display_type" 
    }
)

df["has_fingerprints"] = df["has_fingerprints"].fillna(
    df["has_fingerprints"].mode()[0]
)

df["has_nfc"] = df["has_nfc"].fillna(
    df["has_nfc"].mode()[0]
)

df["has_5g"] = df["has_5g"].fillna(
    df["has_5g"].mode()[0]
)

df = df.drop(columns = ["refresh_rate(hz)"])

df.to_csv(
    "data/recommendation_data.csv",
    index=False
)


DATA_PATH = "data/recommendation_data.csv"
WINDOW_PERCENT = 0.10

phones_df = pd.read_csv(DATA_PATH)

