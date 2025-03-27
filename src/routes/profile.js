import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ error: "Missing authorization token" });
        }

        const token = authorization.replace("Bearer ", "");

        const { data: user, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.user.id)
            .single();

        if (profileError) {
            return res.status(400).json({ error: "Profile not found" });
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
});

export default router;