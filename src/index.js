import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.get("/", (req, res)=>{
    res.send("HOLA");
})

app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`)
});