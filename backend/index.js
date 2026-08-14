import express from "express"
import {Pool} from "pg"
import "dotenv/config"
import cors from "cors";
const {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT
}=process.env;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.json({message: "server running"});
});

app.post("/expenses",async (req,res)=>{
    try{
        const {userId,title, amount, category,expenseDate} = req.body;
    const result = await pool.query(
        `insert into expenses(title,amount,category,expense_date,user_id) values($1,$2,$3,$4,$5) returning *`,[title,amount,category,expenseDate,userId]
    );
    const insertedExpense = result.rows[0];
    res.status(201).json(insertedExpense)
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/expenses", async (req,res)=>{
    try {
        const result = await pool.query(
            "select * from expenses"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.delete("/expenses/:id", async (req,res)=>{
    try {
        const id=req.params.id;
        const result =await pool.query(
            `delete from expenses where id=$1`,[id]
        )

        if(result.rowCount===0){
            return res.status(404).json({error: "Expense not found"});
        }
        res.status(200).json({message: "Expense deleted"});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
});

