// Component rendering functions
window.Components = {
    renderProductCard: (product) => {
        const statusClass = product.status === 'tersedia' ? 'tersedia' : 'habis';
        return `
            <div class="product-card" data-product-id="${product.id}">
                <h3>${product.name}</h3>
                <div class="price">Rp ${product.price.toLocaleString()}</div>
                <div class="stock">Stok: ${product.stock}</div>
                <div class="status ${statusClass}">${product.status === 'tersedia' ? '✓ Tersedia' : '✗ Habis'}</div>
                <button class="btn-primary order-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-status="${product.status}">
                    Order Sekarang
                </button>
            </div>
        `;
    },

    renderJasaCard: (jasa) => {
        return `
            <div class="jasa-card">
                <h3>${jasa.name}</h3>
                <div class="price">Rp ${jasa.price.toLocaleString()}</div>
                <div class="stock">Estimasi: ${jasa.duration}</div>
                <p style="margin: 10px 0;">${jasa.description}</p>
                <button class="btn-primary order-jasa-btn" data-name="${jasa.name}" data-price="${jasa.price}">
                    Pesan Jasa
                </button>
            </div>
        `;
    },

    renderAdminProductCard: (product) => {
        const statusClass = product.status === 'tersedia' ? 'tersedia' : 'habis';
        return `
            <div class="product-card" data-product-id="${product.id}">
                <h3 contenteditable="false" class="product-name-display">${product.name}</h3>
                <div class="price">
                    Rp <span class="product-price-display">${product.price}</span>
                </div>
                <div class="stock">
                    Stok: <span class="product-stock-display">${product.stock}</span>
                </div>
                <div class="status ${statusClass}">
                    <select class="status-select" data-id="${product.id}">
                        <option value="tersedia" ${product.status === 'tersedia' ? 'selected' : ''}>Tersedia</option>
                        <option value="habis" ${product.status === 'habis' ? 'selected' : ''}>Habis</option>
                    </select>
                </div>
                <div class="product-actions">
                    <button class="edit-product-btn" data-id="${product.id}">✏️ Edit</button>
                    <button class="delete-product-btn" data-id="${product.id}">🗑️ Hapus</button>
                </div>
            </div>
        `;
    },

    showToast: (message, isError = false) => {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isError ? '#f44336' : '#4caf50'};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            z-index: 10000;
            animation: fadeZoom 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
