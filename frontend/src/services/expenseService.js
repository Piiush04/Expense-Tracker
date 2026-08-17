const API_URL = "https://expense-tracker-ayup.onrender.com";

export const addExpense = async(title, amount, category, expenseDate, token) => {
    try {
        const response = await fetch(API_URL+"/expenses",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                amount: amount,
                category: category,
                expenseDate: expenseDate,
                
            })
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error || "Failed to add expense");
        }
        return data;
    } catch (error) {
        console.error("Error adding expense : ",error);
        throw error;
    }
};

export const getExpenses = async(token)=>{
    try {
        const response = await fetch(API_URL+"/expenses",{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error getting expense: ", error);
    }
};

export const deleteExpense = async(id,token)=>{
    try {
        const response = await fetch(API_URL+`/expenses/${id}`,{
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error deleting expense: ", error);
    }
};
