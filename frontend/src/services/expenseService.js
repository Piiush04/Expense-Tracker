const API_URL = "http://localhost:5000";

export const addExpense = async(title, amount, category, expenseDate) => {
    try {
        const response = await fetch(API_URL+"/expenses",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                amount: amount,
                category: category,
                expenseDate: expenseDate,
                userId: 1
            })
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error adding expense : ",error);
    }
};

export const getExpenses = async()=>{
    try {
        const response = await fetch(API_URL+"/expenses");
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error getting expense: ", error);
    }
};

export const deleteExpense = async(id)=>{
    try {
        const response = await fetch(API_URL+`/expenses/${id}`,{
            method: "DELETE"
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error deleting expense: ", error);
    }
};