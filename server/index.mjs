import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { genSalt, hash } from "bcrypt";
import cors from "cors";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "/.env") });

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const posts = await prisma.users.findMany();
  res.json(posts);
});

app.post("/account", async (req, res) => {
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

  const authtoken = jwt.sign(uid, process.env.JWT_SECRET_KEY);

  const salt = await genSalt(10);
  password = await hash(password, salt);

  const post = await prisma.users.create({
    data: {
      uid,
      name,
      email,
      password,
      authtoken,
    },
  });
  res
    .status(200)
    .json({ message: "Account creation succeded!", authtoken: authtoken });
});

app.get("/account", async (req, res) => {
  const body = req.body;
  const user = await prisma.users.findMany({ email: body.email });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      res.status(200).json({ message: "Valid password" });
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
