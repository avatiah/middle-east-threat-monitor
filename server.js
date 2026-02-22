const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// 1. Имитация базы данных (здесь храним последние проверенные значения)
let currentData = {
    energy: [
        { name: "Oil (Brent)", price: 71.49, change: -0.63, time: "LIVE" },
        { name: "Coal (API2)", price: 116.70, change: 1.25, time: "LIVE" }
    ],
    threat_index: 6.5,
    osint: [
        { src: "SYSTEM", text: "Backend bridge active. Waiting for signal updates..." }
    ]
};

// 2. Эндпоинт для Фронтенда (Sandbox и Main Terminal будут стучаться сюда)
app.get('/api/data', (req, res) => {
    res.json(currentData);
});

// 3. Эндпоинт для "Умного поиска" в Sandbox
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    console.log(`[SANDBOX] Searching for: ${query}`);
    
    // В будущем здесь будет реальный API вызов к NewsAPI или Google Search
    // Пока возвращаем структурированный "сырой" OSINT для теста
    const rawResults = [
        { src: "RAW_NEWS_FEED", text: `Found update related to ${query}: Increased activity at monitoring stations.` },
        { src: "INSS_SIMULATOR", text: "Strategic assessment shows shift in regional posture." }
    ];
    
    res.json(rawResults);
});

// 4. Запуск сервера
app.listen(PORT, () => {
    console.log(`--- THREAT ENGINE BACKEND RUNNING ON PORT ${PORT} ---`);
});
