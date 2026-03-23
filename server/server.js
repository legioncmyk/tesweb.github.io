const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Initialize JSON files
async function initFiles() {
    try {
        await fs.access(PRODUCTS_FILE);
    } catch {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify([
            { id: 1, name: "CapCut Pro 1 Bulan", price: 25000, stock: 10, status: "tersedia" },
            { id: 2, name: "Canva Pro 1 Tahun", price: 75000, stock: 5, status: "tersedia" },
            { id: 3, name: "Spotify Premium 3 Bulan", price: 45000, stock: 8, status: "tersedia" },
            { id: 4, name: "Netflix Premium 1 Bulan", price: 35000, stock: 0, status: "habis" }
        ], null, 2));
    }
    
    try {
        await fs.access(USERS_FILE);
    } catch {
        await fs.writeFile(USERS_FILE, JSON.stringify([
            { id: 1, username: "user1", password: "pass123", email: "user1@example.com", member: "Jan 2024" },
            { id: 2, username: "user2", password: "pass123", email: "user2@example.com", member: "Feb 2024" }
        ], null, 2));
    }
}

// Products API
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read products' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        const newProduct = { ...req.body, id: Date.now() };
        products.push(newProduct);
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...req.body };
            await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
            res.json(products[index]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let products = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf8'));
        products = products.filter(p => p.id !== id);
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read users' });
    }
});

initFiles().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ ZALLSTORE server running at http://localhost:${PORT}`);
        console.log(`📱 Akses website: http://localhost:${PORT}`);
    });
});
