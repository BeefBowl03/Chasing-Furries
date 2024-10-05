const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the fs module
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // To handle large base64 images
app.use(cors({
    origin: ['https://chasing-furries.tiiny.site', 'https://beefbowl03.github.io'], // Allow multiple origins
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads'); // Path to uploads directory
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Create the uploads directory
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save to the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
    }
});

const upload = multer({ storage: storage });

// MongoDB connection URI
const uri = "mongodb+srv://BeefBowl:Laurenzo%403@beefbowl.zw2kp.mongodb.net/?retryWrites=true&w=majority&appName=BeefBowl";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to the MongoDB database
async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('chasing_furries_db');
        const missingDogsCollection = db.collection('missingDogs');
        const foundDogsCollection = db.collection('foundDogs');

        // Route for the root URL
        app.get('/', (req, res) => {
            res.send('Welcome to the Dog Reporting API! Use the endpoints /api/missing-dogs and /api/found-dogs to submit reports.');
        });

        // Route to handle missing dog form submission
        app.post('/api/missing-dogs', upload.single('photo'), async (req, res) => {
            try {
                const { name, breed, lastSeen } = req.body;
                const photo = req.file ? req.file.path : null; // Get the path to the uploaded photo
                const missingDogData = { name, breed, lastSeen, photo };
                await missingDogsCollection.insertOne(missingDogData);
                res.status(201).json({ message: 'Missing dog report saved successfully!' });
            } catch (err) {
                res.status(500).json({ message: 'Failed to save missing dog report', error: err });
            }
        });

        // Route to get all missing dog reports
        app.get('/api/missing-dogs', async (req, res) => {
            try {
                const missingDogs = await missingDogsCollection.find().toArray();
                res.status(200).json(missingDogs);
            } catch (err) {
                res.status(500).json({ message: 'Failed to fetch missing dog reports', error: err });
            }
        });

        // Route to handle found dog form submission
        app.post('/api/found-dogs', upload.single('photo'), async (req, res) => {
            try {
                const { name, breed, foundLocation } = req.body;
                const photo = req.file ? req.file.path : null; // Get the path to the uploaded photo
                const foundDogData = { name, breed, foundLocation, photo };
                await foundDogsCollection.insertOne(foundDogData);
                res.status(201).json({ message: 'Found dog report saved successfully!' });
            } catch (err) {
                res.status(500).json({ message: 'Failed to save found dog report', error: err });
            }
        });

        // Route to get all found dog reports
        app.get('/api/found-dogs', async (req, res) => {
            try {
                const foundDogs = await foundDogsCollection.find().toArray();
                res.status(200).json(foundDogs);
            } catch (err) {
                res.status(500).json({ message: 'Failed to fetch found dog reports', error: err });
            }
        });

        // Route to delete a found dog
        app.delete('/api/found-dogs', async (req, res) => {
            const { id } = req.body; // Get the unique ID from the request body
            try {
                const result = await foundDogsCollection.deleteOne({ _id: new MongoClient.ObjectId(id) }); // Use the unique identifier
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Found dog removed' });
                } else {
                    res.status(404).json({ message: 'Found dog not found' });
                }
            } catch (err) {
                res.status(500).json({ message: 'Failed to remove found dog', error: err });
            }
        });

        // Route to delete a missing dog by ID
        app.delete('/api/missing-dogs/:id', async (req, res) => {
            const { id } = req.params; // Get the unique ID from the URL parameters
            try {
                const result = await missingDogsCollection.deleteOne({ _id: new MongoClient.ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Missing dog removed' });
                } else {
                    res.status(404).json({ message: 'Missing dog not found' });
                }
            } catch (err) {
                res.status(500).json({ message: 'Failed to remove missing dog', error: err });
            }
        });


        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

run().catch(console.dir);
