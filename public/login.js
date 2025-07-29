document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const credentials = {
    email: this.email.value.trim(),
    password: this.password.value
  };

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.status === 200) {
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      window.location.href = '/chat'; // ✅ redirect to chat UI
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Network error');
  }
});
