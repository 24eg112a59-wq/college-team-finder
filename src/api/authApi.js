const BASE_URL = "http://localhost:8080/api/auth";

export async function loginUser(username, password){
    const response = await fetch(`${BASE_URL}/login`, {
        method:"POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({username, password}),
    });
    if(!response.ok){
        throw new Error("Invalid username or password");
    }
    return response.json();
}

export async function registerUser(username, email, password, role){
    const response = await fetch(`${BASE_URL}/Register`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username, email, password, role}),
    });
    if(!response.ok){
        throw new Error("Registration failed");
    }
    return response.json();
}
export async function logoutUser(token){
    await fetch(`${BASE_URL}/logout`,{
        method: "POST",
        headers: {Authorization: `Bearer ${token}`},
    });
}
export async function fetchProtection(url, token){
    const response = await fetch(`http://localhost:8080${url}`,{
    headers: {Authorization: `Bearer ${token}`}
    });
    if(!response.ok){
        throw new Error("Access denied");
    }
    return response.text();
}