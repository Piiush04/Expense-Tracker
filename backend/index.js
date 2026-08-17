import express from "express"
import {Pool} from "pg"
import "dotenv/config"
import cors from "cors";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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

const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({error: "No token"});
    }

    jwt.verify(token, "secret_key", (err, user)=>{
        if(err) return res.status(403).json({error: "Invalid token"});
        req.user = user;
        next();
    })
}


app.get("/", (req,res)=>{
    res.json({message: "server running"});
});

app.post("/signup", async (req,res)=>{
    try {
        const {email, password} = req.body;
        const userExists = await pool.query("select * from users where email = $1",[email]);
        if(userExists.rows.length>0){
            return res.status(400).json({error: "User already exists"});
        }

        const hashedPassword= await bcrypt.hash(password,10);

        const result = await pool.query("insert into users(email, password) values($1,$2) returning id,email", [email,hashedPassword]);

        const token = jwt.sign({userId: result.rows[0].id}, "secret_key", {expiresIn: "7d"});

        res.status(201).json({ token, user: result.rows[0]});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

app.post("/login", async (req,res)=>{
    try {
        const {email, password}= req.body;
        const user = await pool.query("select * from users where email=$1",[email]);
        if(user.rows.length==0){
            return res.status(401).json({error: "Invalid email or password"})
        }

        const validPassword = await bcrypt.compare(password,user.rows[0].password);

        if(!validPassword){
            return res.status(401).json({error: "Invalid email or password"});
        }

        const token = jwt.sign({userId: user.rows[0].id}, "secret_key", {expiresIn: "7d"});

        return res.status(200).json({token, user: {id: user.rows[0].id, email: user.rows[0].email}})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})
app.post("/expenses",authenticateToken, async (req,res)=>{
    try{
        const {title, amount, category,expenseDate} = req.body;
        const userId = req.user.userId;
    const result = await pool.query(
        `insert into expenses(title,amount,category,expense_date,user_id) values($1,$2,$3,$4,$5) returning *`,[title,amount,category,expenseDate,userId]
    );
    const insertedExpense = result.rows[0];
    res.status(201).json(insertedExpense)
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/expenses", authenticateToken, async (req,res)=>{
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            "select * from expenses where user_id=$1",[userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.delete("/expenses/:id", authenticateToken, async (req,res)=>{
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

