
const loginBtn = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username.trim() === "admin" && password.trim() === "admin123") {
    window.location.href = 'home.html';
    alert("Login Successful");
  } else {
    alert("Login Failed");
    return;
  }
};
