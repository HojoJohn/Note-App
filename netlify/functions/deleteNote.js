const { MongoClient, ObjectId } = require('mongodb');

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
    // Only allow DELETE requests
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const collection = await connectToDatabase();

        // Extracting the note ID from the event path
        const noteId = event.path.split("/").pop();
        
        // Validating the note ID
        if (!ObjectId.isValid(noteId)) {
            return { statusCode: 400, body: 'Invalid note ID' };
        }

        // Deleting the note
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(noteId) });
        // If no note was deleted, return a 404 error
        if (deletedCount === 0) {
            return { statusCode: 404, body: 'Note not found' };
        }

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note deleted successfully' }),
        };
    } catch (error) {
        console.error("Error in deleteNote function:", error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
};
