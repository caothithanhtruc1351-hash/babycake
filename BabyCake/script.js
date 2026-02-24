document.addEventListener("DOMContentLoaded", function () {
  const cartToggle = document.querySelector(".cart-toggle");
  const cartBox = document.getElementById("cart-box");

  cartToggle.addEventListener("click", function () {
    cartBox.classList.toggle("show");
  });

  updateCartUI(); // Khi tải trang
   // Hiển thị thông tin người dùng và xử lý đăng xuất
  const username = localStorage.getItem("loggedInUser");
  if (username) {
    document.getElementById("welcome-user").textContent = `👋 Xin chào, ${username}`;
    document.getElementById("login-link").style.display = "none";
    document.getElementById("logout-btn").classList.remove("hidden");

    document.getElementById("logout-btn").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      location.reload();
    });
  }
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(button) {
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));
  const image = button.getAttribute("data-image");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}
// Cập nhật giỏ hàng //
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const total = document.getElementById("total");

  cartItems.innerHTML = "";
  let totalAmount = 0;
  let totalQuantity = 0;
if (cart.length === 0) {
  cartItems.innerHTML = `<p>Hiện chưa có sản phẩm nào trong giỏ hàng.</p>`;
  total.textContent = "Tổng tiền: 0đ";
  return;
}
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 8px;">
        <div style="flex: 1;">
          <strong>${item.name}</strong><br>
          Giá: ${item.price.toLocaleString()}đ
          <div style="display: flex; align-items: center; margin-top: 5px;">
            <button onclick="changeQuantity('${item.name}', -1)">-</button>
            <span style="margin: 0 8px;">${item.quantity}</span>
            <button onclick="changeQuantity('${item.name}', 1)">+</button>
          </div>
        </div>
        <button onclick="removeItem('${item.name}')" style="background: #ff4d4f; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">X</button>
      </div>
    `;
    cartItems.appendChild(li);

    totalAmount += item.price * item.quantity;
    totalQuantity += item.quantity;
  });

  cartCount.textContent = totalQuantity;
  total.textContent = `Tổng tiền: ${totalAmount.toLocaleString()}đ`;
}

function changeQuantity(name, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find(i => i.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Cập nhật lại giao diện cho cả trang index và trang giỏ hàng nếu có
  if (typeof updateCartUI === "function") updateCartUI();
  if (typeof renderCartPage === "function") renderCartPage(); // <== Thêm dòng này
}

function removeItem(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));

  if (typeof updateCartUI === "function") updateCartUI();
  if (typeof renderCartPage === "function") renderCartPage(); // Thêm dòng này
}


// Xóa giỏ hàng
function clearCart() {
  localStorage.removeItem("cart");
  updateCartUI(); 
}

// Chuyển hướng đến trang giỏ hàng (nếu có)
function viewCart() {
  window.location.href = "giohang.html";
}

// Hàm gọi popup thanh toán từ trang bất kỳ
function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống.");
  } else {
    document.getElementById("checkout-popup").classList.remove("hidden");
  }
}
window.checkout = checkout; // Để gọi được từ HTML

// Ẩn popup khi bấm "Hủy"
window.closeCheckoutForm = function () {
  document.getElementById("checkout-popup").classList.add("hidden");
  document.getElementById("checkout-result").textContent = "";
  document.getElementById("popup-name").value = "";
  document.getElementById("popup-phone").value = "";
};

// Xác nhận đặt hàng
window.confirmCheckout = function () {
  const name = document.getElementById("popup-name").value.trim();
  const phone = document.getElementById("popup-phone").value.trim();
  const result = document.getElementById("checkout-result");

  if (!name || !phone) {
    alert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
    return;
  }

  // Hiển thị kết quả
  result.textContent = `🎉 Cảm ơn ${name}, chúng tôi sẽ liên hệ với bạn qua số ${phone} để xác nhận đơn hàng.`;

  // Xóa giỏ hàng sau xác nhận
  localStorage.removeItem("cart");
  renderCartPage();
  if (typeof updateCartUI === "function") updateCartUI();
};



// Cho phép gọi các hàm từ HTML
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.renderCartPage = renderCartPage;
