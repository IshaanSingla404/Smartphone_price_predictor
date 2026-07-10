import pandas as pd
from sklearn.preprocessing import MinMaxScaler


DATA_PATH = "Data/recommendation_data.csv"
WINDOW_PERCENT = 0.10

PROCESSOR_SCORE = {
    "apple": 10,
    "snapdragon": 9,
    "google": 8,
    "mediatek": 7,
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

    scaler = MinMaxScaler()

    columns_to_scale = [
        "ram",
        "storage",
        "num_cores",
        "processor_score"
    ]

    filtered_df[columns_to_scale] = scaler.fit_transform(
        filtered_df[columns_to_scale]
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

def score_camera(filtered_df):

    filtered_df = filtered_df.copy()

    scaler = MinMaxScaler()

    columns_to_Scale = [
        "primary_rear_camera",
        "primary_front_camera",
        "num_rear_cameras",
        "num_front_cameras"
    ]

    filtered_df[columns_to_Scale] = scaler.fit_transform(
        filtered_df[columns_to_Scale]
    )

    filtered_df["camera_score"] = (
        filtered_df["primary_rear_camera"] * 0.50 +
        filtered_df["primary_front_camera"] * 0.20 +
        filtered_df["num_rear_cameras"] * 0.20 +
        filtered_df["num_front_cameras"] * 0.10 
    )

    filtered_df = filtered_df.sort_values(
        by = "camera_score",
        ascending=False
    )

    return filtered_df.head(5)

FAST_CHARGING_SCORE = {
    "yes": 1,
    "no": 0
}

def score_battery(filtered_df):

    filtered_df = filtered_df.copy()

    filtered_df["fast_charging_score"] = (
        filtered_df["has_fast_charging"]
        .str.lower()
        .map(FAST_CHARGING_SCORE)
    )

    scaler = MinMaxScaler()

    columns_to_scale = [
        "battery_capacity",
        "fast_charging_score"
    ]

    filtered_df[columns_to_scale] = scaler.fit_transform(
        filtered_df[columns_to_scale]
    )

    filtered_df["battery_score"] = (
        filtered_df["battery_capacity"] * 0.80 +
        filtered_df["fast_charging_score"] * 0.20
    )

    filtered_df = filtered_df.sort_values(
        by="battery_score",
        ascending=False
    )

    return filtered_df.head(5)

DISPLAY_SCORE = {
    "amoled": 5,
    "oled": 4,
    "p-oled": 4,
    "super amoled": 5,
    "ips lcd": 3,
    "lcd": 2,
    "tft": 1
}

def score_display(filtered_df):

    filtered_df = filtered_df.copy()

    filtered_df["display_type_score"] = (
        filtered_df["display_type"]
        .str.lower()
        .map(DISPLAY_SCORE)
        .fillna(2)
    )

    scaler = MinMaxScaler()

    columns_to_scale = [
        "display_size",
        "display_type_score"
    ]

    filtered_df[columns_to_scale] = scaler.fit_transform(
        filtered_df[columns_to_scale]
    )

    filtered_df["display_score"] = (
        filtered_df["display_size"] * 0.40 +
        filtered_df["display_type_score"] * 0.60
    )

    filtered_df = filtered_df.sort_values(
        by="display_score",
        ascending=False
    )

    return filtered_df.head(5)


def score_balanced(filtered_df):

    filtered_df = filtered_df.copy()

    # Processor
    filtered_df["processor_score"] = (
        filtered_df["processor_brand"]
        .str.lower()
        .map(PROCESSOR_SCORE)
    )

    # Fast Charging
    filtered_df["fast_charging_score"] = (
        filtered_df["has_fast_charging"]
        .str.lower()
        .map(FAST_CHARGING_SCORE)
    )

    # Display
    filtered_df["display_type_score"] = (
        filtered_df["display_type"]
        .str.lower()
        .map(DISPLAY_SCORE)
        .fillna(2)
    )

    scaler = MinMaxScaler()

    columns_to_scale = [
        "ram",
        "storage",
        "processor_score",
        "num_cores",
        "primary_rear_camera",
        "primary_front_camera",
        "battery_capacity",
        "fast_charging_score",
        "display_size",
        "display_type_score"
    ]

    filtered_df[columns_to_scale] = scaler.fit_transform(
        filtered_df[columns_to_scale]
    )

    filtered_df["balanced_score"] = (
        (
            filtered_df["ram"] * 0.40 +
            filtered_df["storage"] * 0.25 +
            filtered_df["processor_score"] * 0.20 +
            filtered_df["num_cores"] * 0.15
        ) * 0.30 +

        (
            filtered_df["primary_rear_camera"] * 0.50 +
            filtered_df["primary_front_camera"] * 0.20 +
            filtered_df["num_rear_cameras"] * 0.20 +
            filtered_df["num_front_cameras"] * 0.10
        ) * 0.30 +

        (
            filtered_df["battery_capacity"] * 0.80 +
            filtered_df["fast_charging_score"] * 0.20
        ) * 0.20 +

        (
            filtered_df["display_size"] * 0.40 +
            filtered_df["display_type_score"] * 0.60
        ) * 0.20
    )

    filtered_df = filtered_df.sort_values(
        by="balanced_score",
        ascending=False
    )

    return filtered_df.head(5)


def recommend_phones(predicted_price, preference):

    filtered = filter_by_budget(predicted_price)

    if preference == "performance":
        return score_performance(filtered)

    elif preference == "camera":
        return score_camera(filtered)

    elif preference == "battery":
        return score_battery(filtered)

    elif preference == "display":
        return score_display(filtered)

    elif preference == "balanced":
        return score_balanced(filtered)

    else:
        raise ValueError("Invalid Preference")

if __name__ == "__main__":

    filtered = filter_by_budget(38000)

    # Performance
    performance = score_performance(filtered)
    print("=" * 70)
    print("PERFORMANCE RECOMMENDATIONS")
    print(performance[["phone_name", "price", "performance_score"]])

    # Camera
    camera = score_camera(filtered)
    print("\n" + "=" * 70)
    print("CAMERA RECOMMENDATIONS")
    print(camera[["phone_name", "price", "camera_score"]])

    # Battery
    battery = score_battery(filtered)
    print("\n" + "=" * 70)
    print("BATTERY RECOMMENDATIONS")
    print(battery[["phone_name", "price", "battery_score"]])

    # Display
    display = score_display(filtered)
    print("\n" + "=" * 70)
    print("DISPLAY RECOMMENDATIONS")
    print(display[["phone_name", "price", "display_score"]])

    # Balanced
    balanced = score_balanced(filtered)
    print("\n" + "=" * 70)
    print("BALANCED RECOMMENDATIONS")
    print(balanced[["phone_name", "price", "balanced_score"]])

