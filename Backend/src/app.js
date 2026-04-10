import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app =express()

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});




export default app;