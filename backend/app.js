import express from "express";
import cartRoutes from "./routes/cartRoutes.js";
// import other routes if needed
// import userRoutes from "./userRoutes.js";
// import orderRoutes from "./orderRoutes.js";
// import productRoutes from "./productRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/cart", cartRoutes);
// app.use("/users", userRoutes);
// app.use("/orders", orderRoutes);
// app.use("/products", catalogRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running." });
});

export default app;
