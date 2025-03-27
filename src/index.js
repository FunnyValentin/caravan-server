import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

const httpServer = createServer(app);
const io = new Server(httpServer)

app.get("/", (req, res)=>{
    res.send("HOLA");
})

httpServer.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`)
});