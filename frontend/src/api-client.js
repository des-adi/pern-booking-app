const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async({firstName, lastName, email, password}) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({firstName, lastName, email, password}),
    });

    const responseBody = await response.json();
    if(!response.ok){
        throw new Error(responseBody.message);
    }
    return responseBody;
};

export const signIn = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type" : "application/json",
        },
        body: JSON.stringify(formData),
    });

    const body = await response.json();
    if(!response.ok){
        throw new Error(body.message);
    }
    return body;
};

export const validateToken = async() => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",  //include any http cookies
    });

    if(!response.ok){
        throw new Error("Token Invalid");
    }
    return response.json();
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
    });

    if(!response.ok){
        throw new Error("Error during signout");
    }
};