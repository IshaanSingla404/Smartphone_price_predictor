# Data Manipulation
import pandas as pd
import numpy as np

# Scikit-Learn
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer

# Metrics
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.linear_model import LinearRegression


def main():

    #dataset
    df = pd.read_csv("Data/cleaned_smartphones.csv")

    X = df.drop(columns = ["price", "brand_name"])
    y = df["price"]

    #train test split:

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size = 0.2,
        random_state = 42
    )

    categorical_features = X_train.select_dtypes(
    include=["object", "string"]
    ).columns.tolist()

    numerical_features = X_train.select_dtypes(
    include=["int64", "float64"]
    ).columns.tolist()

    numerical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy = "median"))
        ]
    )
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy = "most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown = "ignore"))
        ]
    )

    preprocessor = ColumnTransformer(
        transformers = [
            ("num", numerical_transformer, numerical_features),
            ("cat", categorical_transformer, categorical_features)
        ]
    )

    #ML pipeline

    pipeline = Pipeline(
        steps = [
            ("preprocessor", preprocessor),
            ("regression", LinearRegression())
        ]
    )

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    print(f"MAE : {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"R²  : {r2:.4f}")






if __name__ == "__main__":
    main()


