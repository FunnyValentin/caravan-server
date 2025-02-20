import express from "express";
import supabase from "../config/supabase.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.use(fileUpload({
  limits: {fileSize: 5 * 1024 * 1024}
}));

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  let avatarUrl = null; // Initialize to null
  let avatar = req.files?.avatar;

  try {
    // Create user in Supabase authentication
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (avatar) {
      const fileExt = avatar.mimetype.split("/")[1];
      const filePath = `avatars/${data.user.id}/avatar.${fileExt}`;

      // Upload the avatar
      const { error: avatarError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar.data, { contentType: avatar.mimetype });

      if (avatarError) {
        return res.status(400).json({ error: avatarError.message });
      }

      // Get public URL correctly using the Supabase docs' approach
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
    }

    // Insert profile into the database
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      email,
      caps: 500,
      avatar_url: avatarUrl, // Correctly assigned
    });

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({ message: "User registered successfully", user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", async(req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "User logged in successfully", user: data});    
  } catch {
    res.status(500).json({ error: "Internal server error"});
  }
})

export default router;