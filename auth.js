function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const message = document.getElementById("register-message");

  if (!username || !password) {
    message.style.color = "red";
    message.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.find(user => user.username === username);

  if (exists) {
    message.style.color = "red";
    message.textContent = "Tên đăng nhập đã tồn tại.";
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  message.style.color = "green";
  message.textContent = "Đăng ký thành công!";
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const message = document.getElementById("login-message");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const found = users.find(user => user.username === username && user.password === password);

  if (found) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html"; // Hoặc chuyển sang trang chủ
  } else {
    message.textContent = "Sai tên đăng nhập hoặc mật khẩu.";
  }
}
