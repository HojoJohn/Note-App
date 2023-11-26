const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'noteapp';
const COLLECTION_NAME = 'notes';

const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
    try {
        await client.connect();
        return client.db(DB_NAME).collection(COLLECTION_NAME);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const collection = await connectToDatabase();
        const noteId = event.path.split("/").pop();

        if (!ObjectId.isValid(noteId)) {
            return { statusCode: 400, body: 'Invalid note ID' };
        }

        const note = await collection.findOne({ _id: new ObjectId(noteId) }); // Updated line
        if (!note) {
            return { statusCode: 404, body: 'Note not found' };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(note),
        };
    } catch (error) {
        console.error("Error in getNote function:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ 
                message: 'Internal Server Error', 
                error: error.message 
            }) 
        };
    } finally {
        try {
            await client.close();
        } catch (closeError) {
            console.error("Error closing the MongoDB connection:", closeError.message);
        }
    }
};
