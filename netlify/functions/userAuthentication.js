const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// MongoDB connection URI and database settings from environment variables
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'noteapp';                // Replace with your database name
const USER_COLLECTION_NAME = 'users';     // Replace with your user collection name
const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT

// Creating a new MongoClient
const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
    await client.connect();
    return client.db(DB_NAME).collection(USER_COLLECTION_NAME);
}

// Netlify function handler
exports.handler = async (event, context) => {
    // Only allow POST requests for login
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Connect to the database
        const collection = await connectToDatabase();

        // Retrieve the user by username
        const user = await collection.findOne({ username });

        if (!user) {
            return { statusCode: 401, body: 'Unauthorized: No such user found' };
        }

        // Check if the password is correct
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return { statusCode: 401, body: 'Unauthorized: Incorrect password' };
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Authentication successful', token }),
        };
    } catch (error) {
        console.error("Error in userAuthentication function:", error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
};
