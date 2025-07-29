document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const userData = {
    name: this.name.value,
    email: this.email.value,
    phone: this.phone.value,
    password: this.password.value,
  };

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.status === 201) {
      alert('Successfully signed up');
      // optionally redirect to login
    } else if (response.status === 409) {
      alert('User already exists, Please Login');
    } else {
      alert('Signup failed: ' + data.message);
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  }
});
