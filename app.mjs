import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

const port = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protectedData = [
  {
    id: 0,
    name: "dave",
  },
  {
    id: 1,
    name: "james",
  },
];

const users = [
  {
    userId: 0,
    username: "thegrandguy",
    password: "don't store passwords in plain text lol",
    firstName: "john",
    lastName: "smith",
  },
  {
    userId: 1,
    username: "a",
    password: "aa",
    firstName: "bob",
    lastName: "builder",
  },
];

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

// app.get("/demo/:parameter", (req, res) => {
//   const parameter = req.params.parameter;
//   res.json(parameter);
// });

app.get("/users/:userId", (req, res) => {
  const user = users.find(
    (currentUser) => currentUser.userId === Number(req.params.userId)
  );
  res.json(user);
});

// optional data filtering
app.get("/demo?parameter=data", (req, res) => {
  const text = req.query || "hi";
  res.json(text);
});

app.get("/demo", (req, res) => {
  res.end("hello");
});

app.post("/users/create", (req, res) => {
  // this fails if app.use(express.json()) is not called
  const user = req.body;
  users.push(user);
  res.end(`created user: ${JSON.stringify(user)}`);
});

/* JWT (json web token)
  generate and send a token to a user, use that token to tell if a user is signed in so they have access to protected actions (requires authentication)
  structure
  header: contains metadata about the token and signing algorithm
  payload: 
    contains claims, aka statements about some entity (is the entity x? or has x?)
    ex a user id, or whatever you want
  you should use only one of the two options: JWT or SID (session id's)
  signature: used to verify the sender is who they say they are and the message wasn't modified

  jwt.sign(payload, secretKey, [options, callback])

  const secret = "pretend this is an environment variable"
  const token = jwt.sign({ username: user.username }, secret, {
    algorithm: "HS256",
    expiresIn: "10s"
  })

  to send jwts:

  include same secret and algorithm used to sign the token, extracts the jwt from the Authorization header, Authorization: "bearer token"
  if it's valid, it'll call next() or it'll throw an UnauthorizedError except

  app.get("/protectedRoute", expressjwt( { secret: "env variable", algorithms: ["HS256"] }), (req, res) => {
    do stuff
  })
*/

// use post when doing stuff with sensitive info
app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const user = users.find((currentUser) => currentUser.userId === userId);
  if (!user || user.password !== password) {
    return res.status(401).json({ errorMessage: "invalid credentials" });
  }

  const token = jwt.sign({ userId: user.userId }, "use an env var here", {
    algorithm: "HS256",
    expiresIn: "30s",
  });

  res.json({ token: token });
});

// only using a get because not putting data in the server, only returning
app.get(
  "/getProtectedData",
  expressjwt({ secret: "use an env var here", algorithms: ["HS256"] }),
  (req, res) => {
    res.json({ data: protectedData });
    // do stuff
  }
);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
