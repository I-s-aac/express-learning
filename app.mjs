import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const port = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({
    secret: "very secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10000 },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (req, res, next) => {
    // this should run any time a request is sent to the server
    res.cookie("acookie", "myvalue2", { httpOnly: true, maxAge: 10000 });

    // console.log("test");
    next(); // prevents the client from hanging on a response from the server in this function
  },
  (req, res, next) => {
    // console.log("next in the chain");
    next();
  }
);

app.use(
  "/user",
  (req, res, next) => {
    // this should run any time a request is sent to the server
    console.log("thing");
    next(); // prevents the client from hanging on a response from the server in this function
  },
  (req, res, next) => {
    console.log("next in the chain of thing");
    next();
  }
);

// app.get("/exit", (req, res) => {
//   server.close();
//   res.end();
// })

app.get("/test", (req, res) => {
  if (req.session.timesPageViewed) {
    req.session.timesPageViewed++;
    res.setHeader("Content-type", "text/html");
    res.write(`<p>page viewed ${req.session.timesPageViewed} times</p>`);
    res.write(
      `<p>session expires in ${req.session.cookie.maxAge / 1000} seconds</p>`
    );
    res.end();
  } else {
    req.session.timesPageViewed = 1;
    res.end("test");
  }
});

app.get("/", (req, res) => {
  res.cookie("mycookie", "myvalue", { httpOnly: true, maxAge: 10000 });
  // res.sendFile(path.join(__dirname, "index.html"));
  res.send("<h1>hello world</h1>");
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
