import express from "express";
import session from "express-session";
import passport from "passport";

import { configure } from "./config/passport.config.js";
import { authRouter } from "./routes/config.js";

import dotenv from "dotenv";
dotenv.config();

const port = 3000;
const app = express();

// this is where the .pug files are
app.set("views", "./views");
app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SECRET || "jafj;eal",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

configure(passport);
app.use("/auth", authRouter(express, passport));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/displayUserDetails", (req, res) => {
  res.render("userDetails", { user: req.user });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
