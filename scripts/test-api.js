/**
 * Test API Login Endpoint
 * Direct test of the login API
 */

async function testLoginAPI() {
  console.log("🧪 Testing login API endpoint...");

  const testCredentials = {
    email: "admin@crm.local",
    password: "admin123456",
  };

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCredentials),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("📄 Response data:", data);

    if (response.ok) {
      console.log("✅ Login successful!");
    } else {
      console.log("❌ Login failed:", data.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

// Test the API
testLoginAPI();
