const { MongoClient } = require('mongodb');

// MongoDB connection URI and database settings from environment variables
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'noteapp';        // Replace with your database name
const COLLECTION_NAME = 'notes';  // Replace with your collection name

// Creating a new MongoClient
const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
    await client.connect();
    return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// Netlify function handler
exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const collection = await connectToDatabase();

        // Retrieve all notes
        const notes = await collection.find({}).toArray();

        // Return the list of notes with JSON content type
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notes),
        };
    } catch (error) {
        // Enhanced error logging
        console.error("Error in getNotes function:", error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
};
