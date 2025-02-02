import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prepare messages for Gemini format
const prepareHistory = (history) => {
    return history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
};

export const handleChatMessage = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured');
        throw new Error('Chat service is not configured properly');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Start new chat
        const chat = model.startChat({
            history: prepareHistory(history || [])
        });

        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        console.log('Gemini API Response:', response.text());

        res.json({
            success: true,
            response: response.text(),
        });
    } catch (error) {
        console.error('Detailed Gemini API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get response from AI'
        });
    }
});
