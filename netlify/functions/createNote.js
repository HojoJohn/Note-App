const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'noteapp';
const COLLECTION_NAME = 'notes';

const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(DB_NAME).collection(COLLECTION_NAME);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.httpMethod !== 'POST') {
        console.warn("Invalid HTTP method:", event.httpMethod);
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const collection = await connectToDatabase();

        let noteData = {
            title: data.title,
            content: data.content,
            imageBase64: data.imageBase64 || null // Expecting Base64 encoded image string
        };

        console.log("Inserting note data into MongoDB");
        const result = await collection.insertOne(noteData);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note created', id: result.insertedId })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
        };
    } finally {
        console.log("Closing MongoDB connection");
        await client.close();
    }
};
