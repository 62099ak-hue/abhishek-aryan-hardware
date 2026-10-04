// =========================
// CART SYSTEM
// =========================

let cart = [];

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });
    displayCart();
}

function displayCart() {
    let cartDiv = document.getElementById("cartItems");
    let totalSpan = document.getElementById("total");

    if (!cartDiv || !totalSpan) return;

    let total = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = "Your cart is empty.";
    } else {
        cartDiv.innerHTML = "";

        cart.forEach((item, index) => {
            total += item.price;

            cartDiv.innerHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span>${item.name}</span>
                <span>
                    ₹${item.price}
                    <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer; width:auto; padding:0 5px; margin-left:10px;">❌</button>
                </span>
            </div>
            `;
        });
    }

    totalSpan.innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

// =========================
// WHATSAPP ORDER SYSTEM
// =========================

function sendOrder() {
    if (cart.length === 0) {
        alert("Please add at least one product to your cart first.");
        return;
    }

    let nameInput = document.getElementById("customerName");
    let phoneInput = document.getElementById("customerPhone");
    let addressInput = document.getElementById("customerAddress");

    let name = nameInput ? nameInput.value.trim() : "";
    let phone = phoneInput ? phoneInput.value.trim() : "";
    let address = addressInput ? addressInput.value.trim() : "";

    if (name === "" || phone === "" || address === "") {
        alert("Please enter your Name, Mobile Number, and Address.");
        return;
    }

    let total = 0;
    let productsList = "";

    cart.forEach(item => {
        productsList += `• ${item.name} - ₹${item.price}\n`;
        total += item.price;
    });

    let messageText = `🛒 *New Order - Abhishek Aryan Hardware*\n\n` +
                      `👤 Name: ${name}\n` +
                      `📱 Mobile: ${phone}\n` +
                      `📍 Address: ${address}\n\n` +
                      `📦 *Products:*\n${productsList}\n` +
                      `💰 *Total: ₹${total}*`;

    let whatsappNumber = "919471881466";
    let encodedMessage = encodeURIComponent(messageText);
    let url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(url, "_blank");

    cart = [];
    displayCart();
    if (nameInput) nameInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (addressInput) addressInput.value = "";
}

// =========================
// SERVICE BOOKING REQUEST
// =========================

function sendRepairRequest() {
    let name = document.getElementById("repairName").value.trim();
    let phone = document.getElementById("repairPhone").value.trim();
    let issue = document.getElementById("repairIssue").value.trim();

    if (!name || !phone || !issue) {
        alert("Please fill in all details to book a repair service.");
        return;
    }

    let message = `🔥 *Gas Stove Repair Request*\n\n` +
                  `👤 Name: ${name}\n` +
                  `📱 Mobile: ${phone}\n` +
                  `🔧 Problem Description: ${issue}`;

    let whatsappNumber = "919471881466";
    let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank");
}

// =========================
// LIVE SEARCH & CATEGORY FILTER
// =========================

function searchProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let title = product.querySelector("h3").innerText.toLowerCase();
        let description = product.querySelector("p").innerText.toLowerCase();

        if (title.includes(input) || description.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

function filterCategory(category, event) {
    let products = document.querySelectorAll('.product');
    let buttons = document.querySelectorAll('.cat-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// =========================
// LIVE SHOP STATUS CHECKER
// =========================

function checkShopStatus() {
    let now = new Date();
    let hour = now.getHours();
    let statusDiv = document.getElementById("shopStatus");

    if (!statusDiv) return;

    // Shop hours: 7:00 AM (7) to 9:00 PM (21)
    if (hour >= 7 && hour < 21) {
        statusDiv.innerHTML = "🟢 Shop is Currently OPEN (7:00 AM – 9:00 PM)";
        statusDiv.style.color = "#16a34a";
    } else {
        statusDiv.innerHTML = "🔴 Shop is Currently CLOSED (Opens at 7:00 AM)";
        statusDiv.style.color = "#dc2626";
    }
}

window.addEventListener("DOMContentLoaded", checkShopStatus);

// Send Order to Backend & WhatsApp
async function sendOrder() {
    if (cart.length === 0) {
        alert("Please add at least one product to your cart first.");
        return;
    }

    let name = document.getElementById("customerName").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();
    let address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
        alert("Please enter your Name, Mobile Number, and Address.");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // 1. Save order to MongoDB database
    try {
        await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: name,
                customerPhone: phone,
                customerAddress: address,
                items: cart,
                totalAmount: total
            })
        });
    } catch (err) {
        console.error("Failed to log order to server database", err);
    }

    // 2. Open WhatsApp Message
    let productsList = cart.map(i => `• ${i.name} - ₹${i.price}`).join('\n');
    let messageText = `🛒 *New Order - Abhishek Aryan Hardware*\n\n` +
                      `👤 Name: ${name}\n` +
                      `📱 Mobile: ${phone}\n` +
                      `📍 Address: ${address}\n\n` +
                      `📦 *Products:*\n${productsList}\n` +
                      `💰 *Total: ₹${total}*`;

    let url = `https://wa.me/919471881466?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank");

    cart = [];
    displayCart();
}

// Send Repair Booking to Backend & WhatsApp
async function sendRepairRequest() {
    let name = document.getElementById("repairName").value.trim();
    let phone = document.getElementById("repairPhone").value.trim();
    let issue = document.getElementById("repairIssue").value.trim();

    if (!name || !phone || !issue) {
        alert("Please fill in all details to book a repair service.");
        return;
    }

    // 1. Save booking to MongoDB database
    try {
        await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, issue })
        });
    } catch (err) {
        console.error("Failed to log repair request to server database", err);
    }

    // 2. Open WhatsApp Message
    let message = `🔥 *Gas Stove Repair Request*\n\n` +
                  `👤 Name: ${name}\n` +
                  `📱 Mobile: ${phone}\n` +
                  `🔧 Problem Description: ${issue}`;

    let url = `https://wa.me/919471881466?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}