import React, { useState, useEffect } from "react";
import { addExpense, getExpenses, deleteExpense } from "./services/expenseService";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpense] = useState([]);

  const filteredExpenses = selectedCategory === ""?expenses: expenses.filter((expense) => expense.category===selectedCategory);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpense(response);
        console.log("Fetched expenses successfully");
      } catch (error) {
        console.log("Can't fetch responses");
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const response = await addExpense(title, amount, category, date);
    setExpense([...expenses, response]);
    setTitle("");
    setAmount("");
    setDate("");
    setCategory("");
  }
  const handleDeleteExpense = async (id) => {
    try {
      setExpense(expenses.filter((expense) => id !== expense.id));
      const response = await deleteExpense(id);
      console.log(response);
    } catch (error) {
      alert("Failed to delete Expense");
      console.log(error);
    }
  }
  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Clothing">Clothing</option>
        <option value="Travel">Travel</option>
        <option value="Grocery">Grocery</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      <form onSubmit={handleAddExpense}>
        <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" name="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input type="text" name="category" value={category} onChange={e => setCategory(e.target.value)} />
        <input type="text" name="date" value={date} onChange={e => setDate(e.target.value)} />
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