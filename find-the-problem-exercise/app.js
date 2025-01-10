import express from "express";
import friendsRouter from "./routes/friends.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use("/friends", friendsRouter);

app.get("/getCurrentDate", (req, res) => {
  const currentDate = new Date().toLocaleDateString();
  res.send({ currentDate: currentDate });
});

// Start the server
// this is why the server wasn't running
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
