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

PROCESSOR_SCORE = {
    "apple": 10,
    "snapdragon": 9,
    "google": 8,
    "mediaTek": 7,
    "exynos": 6,
    "unisoc": 5
}


phones_df = pd.read_csv(DATA_PATH)

def filter_by_budget(predicted_price):
    
    lower_limit = predicted_price * (1 - WINDOW_PERCENT)
    upper_limit = predicted_price * (1 + WINDOW_PERCENT)

    filtered_df = phones_df[
        (phones_df["price"] >= lower_limit)
        &
        (phones_df["price"] <= upper_limit)
    ]

    return filtered_df

def score_performance(filtered_df):

    filtered_df = filtered_df.copy()

    filtered_df["processor_score"] = (
        filtered_df["processor_brand"]
        .map(PROCESSOR_SCORE)
    )

    filtered_df["performance_score"] = (
    filtered_df["ram"] * 0.40 +
    filtered_df["storage"] * 0.25 +
    filtered_df["processor_score"] * 0.20 +
    filtered_df["num_cores"] * 0.15
    )

    filtered_df = filtered_df.sort_values(
    by="performance_score",
    ascending=False
    )

    return filtered_df.head(5)

if __name__ == "__main__":

    filtered = filter_by_budget(38000)

    recommendations = score_performance(filtered)

    print(
        recommendations[
            [
                "phone_name",
                "price",
                "performance_score"
            ]
        ]
    )
