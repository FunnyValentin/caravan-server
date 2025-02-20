import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ error: "Missing authorization token" });
        }

        const token = authorization.replace("Bearer ", "")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Internal server error: ${err}` });
    }
})