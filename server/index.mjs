import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "/.env") });

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const generateToken = (vars) =>
  new Promise((res, rej) => {
    res(jwt.sign(vars, process.env.JWT_SECRET_KEY));
  });

const verifySession = (token) =>
  new Promise((res, rej) => {
    try {
      var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (
        !(
          JSON.stringify(["uid", "date", "iat"]) ===
          JSON.stringify(Object.keys(decoded))
        )
      )
        return res(false);
      if (new Date(decoded.date) < new Date(Date.now())) {
        return res(false);
      }
      res(decoded);
    } catch (err) {
      res(false);
    }
  });

app.get("/users", async (req, res) => {
  const posts = await prisma.users.findMany();
  res.json(posts);
});

app.post("/account/token", async (req, res) => {
  const authtoken = req.body.authtoken;
  const decoded = await verifySession(authtoken);
  res.status(200).json(decoded == false ? false : true);
});

app.post("/account/register", async (req, res) => {
  const { name, email } = req.body;
  let password = req.body.password;

  if (name == null || email == null || password == null) return res.status(400);

  const user = await prisma.users.findMany({
    where: {
      OR: [
        {
          email: email,
          name: name,
        },
      ],
    },
  });
  if (user.length != 0)
    return res.status(400).json({ message: "Invalid username or email" });

  let uid = uuidv4();

  while (
    (await prisma.users.count({
      where: {
        uid: uid,
      },
    })) !== 0
  ) {
    uid = uuidv4();
  }

  const salt = await genSalt(10);
  password = await hash(password, salt);

  await prisma.users.create({
    data: {
      uid,
      name,
      email,
      password,
    },
  });

  let date = new Date(Date.now());
  date.setDate(date.getDate() + 1);
  const authtoken = await generateToken({ uid: uid, date: date });
  res.status(200).cookie("auth").send({ auth: authtoken, expires: date });
});

app.post("/account/login", async (req, res) => {
  const body = req.body;
  if (body == null) return res.status(400);
  if (
    body.email == null ||
    body.email == "" ||
    body.password == "" ||
    body.password == null
  )
    return res.status(400);
  const user = await prisma.users.findMany({ where: { email: body.email } });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await compare(body.password, user[0].password);
    if (validPassword) {
      let date = new Date(Date.now());
      date.setDate(date.getDate() + 1);
      const authtoken = await generateToken({ uid: user[0].uid, date: date });
      res.status(200).cookie("auth").send({ auth: authtoken, expires: date });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

app.delete("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  const user = await prisma.users.delete({
    where: {
      uid,
    },
  });
  res.json(user);
});

app.post("/blog", async (req, res) => {
  const headers = req.headers;
  if(headers["auth"] == null || headers["auth"] == '')
    return res.status(400).json({ error: "auth not sent" });
  if (headers["sec-fetch-site"] == null || headers["sec-fetch-site"] == "")
    return res.status(400).json({ error: "couldn't verify request" });
  if (!(headers["sec-fetch-site"] === "same-site"))
    return res.status(400).json({ error: "cross-site detected" });
  const decoded = await verifySession(headers["auth"]);
  if(decoded == false)
    return res.status(400).json({ error: "invalid auth" });
    res.status(200).json({ message: "verifed" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
