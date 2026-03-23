const API_BASE_URL = 'http://localhost:3000/api';

window.API = {
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            window.Components.showToast('Gagal mengambil data produk', true);
            return [];
        }
    },

    async addProduct(product) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to add product');
            return await response.json();
        } catch (error) {
            console.error('Error adding product:', error);
            window.Components.showToast('Gagal menambah produk', true);
            return null;
        }
    },

    async updateProduct(id, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!response.ok) throw new Error('Failed to update product');
            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            window.Components.showToast('Gagal mengupdate produk', true);
            return null;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            window.Components.showToast('Gagal menghapus produk', true);
            return false;
        }
    },

    async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
};

// Jasa data static
window.JasaData = [
    { id: 1, name: "Editing Video Cinematic", price: 250000, duration: "2-3 hari", description: "Edit video profesional dengan efek cinematic" },
    { id: 2, name: "Fotografi Produk", price: 150000, duration: "1 hari", description: "Foto produk berkualitas tinggi untuk e-commerce" },
    { id: 3, name: "Video Company Profile", price: 500000, duration: "3-5 hari", description: "Video profil perusahaan dengan konsep modern" },
    { id: 4, name: "Editing Wedding Video", price: 350000, duration: "2-3 hari", description: "Edit video pernikahan dengan musik dan efek" },
    { id: 5, name: "Foto Prewedding", price: 450000, duration: "1 hari", description: "Sesi foto prewedding dengan lokasi pilihan" }
];
