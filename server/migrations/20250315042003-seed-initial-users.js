import bcrypt from "bcrypt";

export const up = async (db, client) => {
  await db.collection("users").insertMany([
    { username: "admin", password: bcrypt.hashSync("1234", 10), role: "admin" },
    { username: "john", password: bcrypt.hashSync("1234", 10), role: "manager" },
    { username: "jack", password: bcrypt.hashSync("1234", 10), role: "manager" },
    {
      username: "alice",
      password: bcrypt.hashSync("1234", 10),
      role: "customer",
    },
    { username: "bob", password: bcrypt.hashSync("1234", 10), role: "customer" },
  ]);
};

export const down = async (db, client) => {
  await db.collection("users").deleteMany({
    username: { $in: ["admin", "john", "jack", "alice", "bob"] }
  });
};
