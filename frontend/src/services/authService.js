const API_URL = "http://localhost:5000";

export const signup = async (email,password) =>{
    try {
        const response = await fetch(API_URL+"/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        if(response.ok){
            return data;
        }else{
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Signup error: ", error);
        throw error;
    }
};

export const login = async(email, password) =>{
   try{ 
    const response = await fetch(API_URL+"/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    });

      const data = await response.json();
        if(response.ok){
            return data;
        }else{
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Login error: ", error);
        throw error;
    }
};