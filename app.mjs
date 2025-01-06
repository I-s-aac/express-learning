import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send(`<h1>hello</h1>`);
// });
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// app.get("/htmltest", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });
app.get("/time", (req, res) => {
  res.send(new Date().toString());
});
app.get("/texttest", (req, res) => {
  res.sendFile(path.join(__dirname, "text.txt"));
});
app.get("/test", (req, res) => {
  // const file = fs.readFileSync("text.txt", "utf8");
  const file = fs.readFileSync("index.html", "utf8");
  res.send(file);
});
app.post("/addUser", (req, res) => {
  const firstName = req.body.firstName;
  const { email, lastName } = req.body;
  const newUser = { email, firstName, lastName };
  users.push(newUser);
  console.log(users);
  res.send(`email: ${email}, first name: ${firstName}, last name: ${lastName}`);
});
app.get("/findUser", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/findUser", (req, res) => {
  const { email } = req.body;
  for (let i = 0; i < users.length; i++) {
    // assuming users length won't change while this is running
    if (users[i].email === email) {
      res.send(
        `<h3>found user ${users[i].firstName} ${users[i].lastName}, ${users[i].email}`
      );
      return;
    }
  }
  res.send(`<h3>no user found</h3>`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
