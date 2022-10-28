import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import cors from "cors";
import cookieParser from 'cookie-parser';

config({ path: join(dirname(fileURLToPath(import.meta.url)), "/.env") });

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const generateToken = (uid) => 
  new Promise((res, rej) => {
    if (
      prisma.users.count({
        where: {
          uid: uid,
        },
      }) === 0
    )
      return rej(new Error("Invalid token"));
    res(jwt.sign(uid, process.env.JWT_SECRET_KEY));
  });

  const verifyToken = (token) => 
  new Promise((res, rej) => {
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res(decoded);
      } catch(err) {
        res(false);
      }
  });


app.get("/users", async (req, res) => {
  const posts = await prisma.users.findMany();
  res.json(posts);
});

app.post("/account/token", async (req, res) => {
    const authtoken = req.body.authtoken;
    const decoded = await verifyToken(authtoken);
    res.status(200).json(decoded);
  });

app.post("/account/register", async (req, res) => {
  if (
    (await prisma.users.count({
      where: {
        OR: [
          {
            email: req.email,
            name: req.name,
          },
        ],
      },
    })) > 0
  ) {
    return res.status(400).json({ message: "Invalid username or email" });
  }

  const { name, email } = req.body;
  let password = req.body.password;
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

  const post = await prisma.users.create({
    data: {
      uid,
      name,
      email,
      password,
    },
  });
  let date = Date.now();
  date.setMinutes(date.getMinutes() + 1);
  const authtoken = await generateToken({ uid: uid, date: date, code: process.env.TOKEN_CODE });
  res
    .status(200)
    .cookie('auth').send(authtoken);
});

app.post("/account/login", async (req, res) => {
  const body = req.body;
  const user = await prisma.users.findMany({ where: { email: body.email } });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await compare(body.password, user[0].password);
    if (validPassword) {
        let date = new Date(Date.now());
        date.setMinutes(date.getMinutes() + 1);
        const authtoken = await generateToken({ uid: user[0].uid, date: date, code: process.env.TOKEN_CODE });
        res
          .status(200)
          .cookie('auth').send(authtoken);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
