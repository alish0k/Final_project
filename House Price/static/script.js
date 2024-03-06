function predictPrice() {
    // Get input values from the form
    const transactionDate = parseFloat(document.getElementById('transaction_date').value);
    const houseAge = parseFloat(document.getElementById('house_age').value);
    const distanceToMRT = parseFloat(document.getElementById('distance_to_mrt').value);
    const convenienceStores = parseFloat(document.getElementById('convenience_stores').value);
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    // Make an AJAX request to the Flask server for prediction
    $.post('/predict', {
        transaction_date: transactionDate,
        house_age: houseAge,
        distance_to_mrt: distanceToMRT,
        convenience_stores: convenienceStores,
        latitude: latitude,
        longitude: longitude
    }, function(prediction) {
        // Display the prediction result
        console.log(prediction);
        document.getElementById('predictionResult').innerText = `Predicted Price: ${prediction.prediction}`;
    });
}