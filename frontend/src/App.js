import React, { useState, useEffect } from "react";
import { addExpense, getExpenses, deleteExpense } from "./services/expenseService";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import "./App.css";
// import { login } from "./services/authService";

function App() {
  const [token, setToken] = useState(null);
  const [currentPage,setCurrentPage] = useState("login");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpense] = useState([]);

  useEffect(()=>{
    const savedToken = localStorage.getItem("token");
    if(savedToken){
      setToken(savedToken);
    }
  },[]);

useEffect(()=>{
  const fetchExpenses = async () => {
    try {
      const response = await getExpenses(token);
      setExpense(response);
      console.log("Fetched expenses successfully");
    } catch (error) {
      console.log("Can't fetch expenses");
    }
  };
  
  if(token){
    fetchExpenses();
  }
},[token]);

  

    // const fetchExpenses = async () => {
    //   try {
    //     const response = await getExpenses(token);
    //     setExpense(response);
    //     console.log("Fetched expenses successfully");
    //   } catch (error) {
    //     console.log("Can't fetch responses");
    //   }
    // };
  
  const handleLoginSuccess = (newToken)=>{
    setToken(newToken);
  }
  
  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentPage("login");
  };

  if(!token){
    return (
      <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      flexDirection: "column",
      gap: "20px",
    }} >
        {
          currentPage==="login"?(<LoginPage onLoginSuccess={handleLoginSuccess} />):(<SignupPage onSignupSuccess={handleLoginSuccess}/>)
        }
        <button style={{
        padding: "10px 20px",
        background: "#667eea",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
      }} onClick={()=>
          setCurrentPage(currentPage==="login"?"signup":"login")
        }>{currentPage==="login"?"Go to signup":"Go to login"}</button>
      </div>
    )
  }
  const filteredExpenses = selectedCategory === ""?expenses: expenses.filter((expense) => expense.category===selectedCategory);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const response = await addExpense(title, amount, category, date,token);
    setExpense([...expenses, response]);
    setTitle("");
    setAmount("");
    setDate("");
    setCategory("");
  }
  const handleDeleteExpense = async (id) => {
    try {
      setExpense(expenses.filter((expense) => id !== expense.id));
      const response = await deleteExpense(id,token);
      console.log(response);
    } catch (error) {
      alert("Failed to delete Expense");
      console.log(error);
    }
  }
  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <button style={{
        padding: "10px 20px",
        background: "black",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        margin: "0 5px 0 0"
      }} onClick={handleLogout}>Logout</button>
      <select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Clothing">Clothing</option>
        <option value="Travel">Travel</option>
        <option value="Grocery">Grocery</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      <form onSubmit={handleAddExpense}>
        <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"/>
        <input type="text" name="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <input type="text" name="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category"/>
        <input type="text" name="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Date"/>
        <button type="submit">Add</button>
      </form>

      <div className="expensesList">
        {
          expenses.length === 0 ? (
            <p>No expenses yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.title}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.category}</td>
                    <td>{expense.expense_date}</td>
                    <td><button onClick={() => handleDeleteExpense(expense.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  )
}

export default App;