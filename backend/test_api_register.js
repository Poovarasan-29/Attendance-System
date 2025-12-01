
const testRegister = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User AutoID',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                department: 'IT'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration successful:', data);
        } else {
            console.log('Registration failed:', data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testRegister();
