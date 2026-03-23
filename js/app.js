// Main application logic
document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    
    // Load preview products on home
    if (path === '/' || path === '/index.html') {
        await loadPreviewProducts();
    }
    
    // Load products on premium page
    if (path === '/premium.html') {
        await loadAllProducts();
    }
    
    // Load jasa on jasa page
    if (path === '/jasa.html') {
        loadJasaList();
    }
    
    // Setup dashboard
    if (path === '/dashboard.html') {
        setupDashboard();
    }
    
    // Setup admin
    if (path === '/admin.html') {
        setupAdmin();
    }
    
    // Setup order buttons (delegation)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('order-btn')) {
            const product = {
                name: e.target.dataset.name,
                price: e.target.dataset.price,
                status: e.target.dataset.status
            };
            sendToWhatsApp(product.name, product.price, product.status);
        }
        
        if (e.target.classList.contains('order-jasa-btn')) {
            const jasa = {
                name: e.target.dataset.name,
                price: e.target.dataset.price
            };
            sendToWhatsApp(jasa.name, jasa.price, 'Jasa Kreatif');
        }
    });
});

async function loadPreviewProducts() {
    const container = document.getElementById('preview-products');
    if (!container) return;
    
    const products = await window.API.getProducts();
    const preview = products.slice(0, 3);
    container.innerHTML = preview.map(p => window.Components.renderProductCard(p)).join('');
}

async function loadAllProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;
    
    const products = await window.API.getProducts();
    if (products.length === 0) {
        container.innerHTML = '<div class="glass-card">Belum ada produk. Silakan login sebagai admin untuk menambah produk.</div>';
        return;
    }
    container.innerHTML = products.map(p => window.Components.renderProductCard(p)).join('');
}

function loadJasaList() {
    const container = document.getElementById('jasa-list');
    if (!container) return;
    
    container.innerHTML = window.JasaData.map(j => window.Components.renderJasaCard(j)).join('');
}

function sendToWhatsApp(productName, price, status) {
    const message = `Halo admin, saya ingin memesan:

Produk: ${productName}
Harga: Rp ${Number(price).toLocaleString()}
Status: ${status}

Saya akan melakukan pembayaran terlebih dahulu melalui DANA ke nomor: 08516930771

Setelah transfer, saya akan mengirim bukti pembayaran ke nomor ini.`;
    
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/6285169307731?text=${encodedMsg}`, '_blank');
}

function setupDashboard() {
    const loginBtn = document.getElementById('btn-login');
    const logoutBtn = document.getElementById('btn-logout');
    const loginSection = document.getElementById('login-section');
    const userInfo = document.getElementById('user-info');
    const orderHistory = document.getElementById('order-history');
    
    const users = [
        { username: 'user1', password: 'pass123', email: 'user1@example.com', member: 'Jan 2024' },
        { username: 'user2', password: 'pass123', email: 'user2@example.com', member: 'Feb 2024' }
    ];
    
    const checkLogin = () => {
        const loggedUser = localStorage.getItem('loggedUser');
        if (loggedUser) {
            const user = JSON.parse(loggedUser);
            loginSection.style.display = 'none';
            userInfo.style.display = 'block';
            orderHistory.style.display = 'block';
            document.getElementById('display-username').textContent = user.username;
            document.getElementById('display-email').textContent = user.email;
            document.getElementById('display-member').textContent = user.member;
            document.getElementById('history-list').innerHTML = '<p>Belum ada pesanan</p>';
        }
    };
    
    if (loginBtn) {
        loginBtn.onclick = () => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('loggedUser', JSON.stringify(user));
                window.Components.showToast('Login berhasil!');
                checkLogin();
            } else {
                window.Components.showToast('Username atau password salah!', true);
            }
        };
    }
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('loggedUser');
            loginSection.style.display = 'block';
            userInfo.style.display = 'none';
            orderHistory.style.display = 'none';
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            window.Components.showToast('Logout berhasil');
        };
    }
    
    checkLogin();
}

function setupAdmin() {
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminLoginDiv = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    
    const checkAdmin = () => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            adminLoginDiv.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminProducts();
        }
    };
    
    if (adminLoginBtn) {
        adminLoginBtn.onclick = () => {
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('isAdmin', 'true');
                window.Components.showToast('Admin login berhasil!');
                checkAdmin();
            } else {
                window.Components.showToast('Login admin gagal!', true);
            }
        };
    }
    
    if (adminLogoutBtn) {
        adminLogoutBtn.onclick = () => {
            localStorage.removeItem('isAdmin');
            adminLoginDiv.style.display = 'block';
            adminPanel.style.display = 'none';
            window.Components.showToast('Admin logout');
        };
    }
    
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.onclick = async () => {
            const name = document.getElementById('new-product-name').value;
            const price = parseInt(document.getElementById('new-product-price').value);
            const stock = parseInt(document.getElementById('new-product-stock').value);
            const status = document.getElementById('new-product-status').value;
            
            if (!name || !price || !stock) {
                window.Components.showToast('Mohon isi semua field!', true);
                return;
            }
            
            const newProduct = {
                id: Date.now(),
                name,
                price,
                stock,
                status
            };
            
            await window.API.addProduct(newProduct);
            window.Components.showToast('Produk berhasil ditambahkan!');
            document.getElementById('new-product-name').value = '';
            document.getElementById('new-product-price').value = '';
            document.getElementById('new-product-stock').value = '';
            loadAdminProducts();
        };
    }
    
    checkAdmin();
}

async function loadAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;
    
    const products = await window.API.getProducts();
    container.innerHTML = products.map(p => window.Components.renderAdminProductCard(p)).join('');
    
    // Attach event listeners for admin actions
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = parseInt(btn.dataset.id);
            const card = btn.closest('.product-card');
            const nameSpan = card.querySelector('.product-name-display');
            const priceSpan = card.querySelector('.product-price-display');
            const stockSpan = card.querySelector('.product-stock-display');
            
            const currentName = nameSpan.textContent;
            const currentPrice = parseInt(priceSpan.textContent);
            const currentStock = parseInt(stockSpan.textContent);
            
            const newName = prompt('Edit nama produk:', currentName);
            const newPrice = prompt('Edit harga:', currentPrice);
            const newStock = prompt('Edit stok:', currentStock);
            
            if (newName && newPrice && newStock) {
                await window.API.updateProduct(id, {
                    name: newName,
                    price: parseInt(newPrice),
                    stock: parseInt(newStock)
                });
                window.Components.showToast('Produk berhasil diupdate!');
                loadAdminProducts();
            }
        };
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.onclick = async () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Yakin ingin menghapus produk ini?')) {
                await window.API.deleteProduct(id);
                window.Components.showToast('Produk berhasil dihapus!');
                loadAdminProducts();
            }
        };
    });
    
    document.querySelectorAll('.status-select').forEach(select => {
        select.onchange = async () => {
            const id = parseInt(select.dataset.id);
            const newStatus = select.value;
            await window.API.updateProduct(id, { status: newStatus });
            window.Components.showToast('Status produk diupdate!');
            loadAdminProducts();
        };
    });
}
