const products = [
    { id: 1, name: '24K Peruvian Gold', price: 1200, type: 'dark', desc: 'A volcanic dark chocolate shell gilded in pure gold, housing a liquid salted caramel core.', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600' },
    { id: 2, name: 'Sicilian Pistachio', price: 850, type: 'milky', desc: 'Hand-picked Bronte pistachios churned into a white chocolate silk ganache.', img: 'https://images.unsplash.com/photo-1542691457-cbe4df041eb2?w=600' },
    { id: 3, name: 'Midnight Smoked Oak', price: 950, type: 'dark', desc: 'Intense 85% cacao infused with the aroma of charred oak barrels and sea salt.', img: 'img21.jpg' },
    { id: 4, name: 'Bulgarian Ruby Rose', price: 750, type: 'milky', desc: 'Natural ruby chocolate with a heart of wild rose reduction and tart berry.', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600' },
    { id: 5, name: 'Kashmiri Saffron', price: 1100, type: 'milky', desc: 'The world\'s finest saffron steeped for 24 hours in velvet milk chocolate.', img: 'img22.jpg' },
    { id: 6, name: 'Arabica Shadow', price: 650, type: 'dark', desc: 'Cold-pressed coffee bean essence folded into a brittle dark chocolate casing.', img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600' }
];

let vault = [];
let currentTray = [];

// Notification Logic
function notify(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// --- CURSOR ---
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    const f = document.getElementById('cursor-follower');
    c.style.left = f.style.left = e.clientX + 'px';
    c.style.top = f.style.top = e.clientY + 'px';
});

function unlock() {
    if(document.getElementById('guestName').value.length < 2) return;
    document.getElementById('gate').style.transform = "translateY(-100%)";
    document.getElementById('main-content').style.display = "block";
    setTimeout(() => {
        document.getElementById('about').style.opacity = "1";
        document.getElementById('about').style.transform = "translateY(0)";
    }, 800);
    renderProducts('all');
    initPicker();
}

function renderProducts(filter) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.filter(p => filter === 'all' || p.type === filter).forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `<img src="${p.img}"><div style="display:flex; justify-content:space-between; align-items:center;"><div><p style="font-size: 13px; font-weight: 600;">${p.name}</p></div><span style="color:var(--gold); font-weight: 600;">₹${p.price}</span></div>`;
        card.onclick = () => openModal(p);
        grid.appendChild(card);
    });
}

function filterItems(type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(type);
}

function openModal(p) {
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalDesc').innerText = p.desc;
    document.getElementById('modalPrice').innerText = `₹${p.price}`;
    document.getElementById('pModal').style.display = 'flex';
    document.getElementById('addBtn').onclick = () => addToVault(p);
}

function closeModal() { document.getElementById('pModal').style.display = 'none'; }

function addToVault(p) {
    vault.push(p);
    updateVaultUI();
    closeModal();
    toggleVault(true);
    notify(`${p.name} secured.`);
}

function updateVaultUI() {
    document.getElementById('cartCount').innerText = vault.length;
    const list = document.getElementById('vault-list');
    const totalEl = document.getElementById('vault-total');
    if(vault.length === 0) {
        list.innerHTML = '<p style="opacity:0.3; text-align:center;">The Archive is empty.</p>';
        totalEl.innerText = '';
        return;
    }
    list.innerHTML = vault.map((item, index) => `
        <div class="vault-item">
            <img src="${item.img}">
            <div style="flex:1">
                <p style="font-size:12px; font-weight:600;">${item.name}</p>
                <p style="font-size:11px; color:var(--gold); margin-top:5px;">₹${item.price}</p>
            </div>
            <span onclick="removeItem(${index})" style="cursor:pointer; opacity:0.3;">✕</span>
        </div>
    `).join('');
    const total = vault.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = `Total: ₹${total}`;
}

function removeItem(index) {
    vault.splice(index, 1);
    updateVaultUI();
}

function toggleVault(forceOpen = false) {
    const d = document.getElementById('vault-drawer');
    if(forceOpen) d.classList.add('open');
    else d.classList.toggle('open');
}

function initPicker() {
    const pContainer = document.getElementById('picker');
    products.forEach(p => {
        const img = document.createElement('img');
        img.src = p.img;
        img.className = 'picker-item';
        img.onclick = () => addToTray(p);
        pContainer.appendChild(img);
    });
}

function addToTray(p) {
    if(currentTray.length < 6) {
        currentTray.push(p);
        const slots = document.querySelectorAll('.slot');
        slots[currentTray.length - 1].innerHTML = `<img src="${p.img}">`;
    } else { notify("Tray is full."); }
}

function resetTray() {
    currentTray = [];
    document.querySelectorAll('.slot').forEach(s => s.innerHTML = "");
}

function addTrayToVault() {
    if(currentTray.length === 6) {
        const trayProduct = { name: "Bespoke Collection (6 Pieces)", price: 2200, img: currentTray[0].img };
        addToVault(trayProduct);
        resetTray();
    } else {
        notify("Please select 6 pieces.");
    }
}

function confirmOrder() {
    if(vault.length === 0) {
        notify("The Archive is Empty");
        return;
    }
    notify("Authenticating Archive...");
    setTimeout(() => {
        vault = [];
        updateVaultUI();
        toggleVault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => notify("Order Secured. Courier Notified."), 800);
    }, 2000);
}
