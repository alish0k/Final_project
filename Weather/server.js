const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/data', (req, res) => {
    const { date } = req.query;

    const combinedMinData = JSON.parse(fs.readFileSync('combined_min.json', 'utf8'));
    const combinedData = JSON.parse(fs.readFileSync('combined.json', 'utf8'));
    const combinedMinAlmatyData = JSON.parse(fs.readFileSync('combined_min_almaty.json', 'utf8'));
    const combinedAlmatyData = JSON.parse(fs.readFileSync('combined_almaty.json', 'utf8'));
    const combinedMinKaragandaData = JSON.parse(fs.readFileSync('combined_min_karaganda.json', 'utf8'));
    const combinedKaragandaData = JSON.parse(fs.readFileSync('combined_karaganda.json', 'utf8'));

    const combinedMinEntry = combinedMinData.find(entry => entry.DATE === date);
    const combinedEntry = combinedData.find(entry => entry.DATE === date);
    const combinedMinAlmatyEntry = combinedMinAlmatyData.find(entry => entry.DATE === date);
    const combinedAlmatyEntry = combinedAlmatyData.find(entry => entry.DATE === date);
    const combinedMinKaragandaEntry = combinedMinKaragandaData.find(entry => entry.DATE === date);
    const combinedKaragandaEntry = combinedKaragandaData.find(entry => entry.DATE === date);

    
    if (!combinedMinEntry || !combinedEntry || !combinedMinAlmatyEntry || !combinedAlmatyEntry || !combinedMinKaragandaEntry || !combinedKaragandaEntry) {
        return res.status(404).json({ error: "Data not found for the provided date." });
    }

    res.json({ combinedMinEntry, combinedEntry, combinedAlmatyEntry, combinedMinAlmatyEntry, combinedMinKaragandaEntry, combinedKaragandaEntry});
});

app.get('/dataByCity', (req, res) => {
    const { date, city } = req.query;

    let combinedMinData, combinedData;

    switch (city) {
        case 'Astana':
            combinedMinData = JSON.parse(fs.readFileSync('combined_min.json', 'utf8'));
            combinedData = JSON.parse(fs.readFileSync('combined.json', 'utf8'));
            break;
        case 'Almaty':
            combinedMinData = JSON.parse(fs.readFileSync('combined_min_almaty.json', 'utf8'));
            combinedData = JSON.parse(fs.readFileSync('combined_almaty.json', 'utf8'));
            break;
        case 'Karaganda':
            combinedMinData = JSON.parse(fs.readFileSync('combined_min_karaganda.json', 'utf8'));
            combinedData = JSON.parse(fs.readFileSync('combined_karaganda.json', 'utf8'));
            break;
        default:
            res.status(400).json({ error: 'Invalid city' });
            return;
    }

    const combinedMinEntry = combinedMinData.find(entry => entry.DATE === date);
    const combinedEntry = combinedData.find(entry => entry.DATE === date);

    res.json({ combinedMinEntry, combinedEntry });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
