from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense

app = Flask(__name__)

file_path = 'Real estate valuation data set.xlsx'  
df = pd.read_excel(file_path)

# Drop the ID column because its not necessary for the model
df = df.drop('No', axis=1)

# Split the data into features (X) and target variable (y)
X = df.drop('Y house price of unit area', axis=1)
y = df['Y house price of unit area']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocess numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Scale the test data


# Build the model
model = Sequential()
model.add(Dense(64, activation='relu', input_dim=X_train.shape[1]))
model.add(Dense(32, activation='relu'))
model.add(Dense(1, activation='linear'))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

# Train the model
model.fit(X_train_scaled, y_train, epochs=200, batch_size=32, validation_split=0.1)
# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        transaction_date = float(request.form['transaction_date'])
        house_age = float(request.form['house_age'])
        distance_to_mrt = float(request.form['distance_to_mrt'])
        convenience_stores = float(request.form['convenience_stores'])
        latitude = float(request.form['latitude'])
        longitude = float(request.form['longitude'])
        new_data = pd.DataFrame({'X1 transaction date':[transaction_date],'X2 house age': [house_age], 'X3 distance to the nearest MRT station': [distance_to_mrt],
                         'X4 number of convenience stores': [convenience_stores], 'X5 latitude': [latitude],
                         'X6 longitude': [longitude]})
        
        new_data_scaled = scaler.transform(new_data[X_train.columns])
       
        # Make prediction
        prediction = model.predict(new_data_scaled)
        print(f'Predicted Price: {prediction[0][0]}')
        res=str(prediction[0][0])
        # Return the prediction as JSON
        return jsonify({'prediction': res})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)