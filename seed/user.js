import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { User } from "../models/UserSchema.js";
import "../config/mongoDB-CONNECTION.js"


export const createUsers = async (num = 10) => {
  try {
    const users = [];

    for (let i = 0; i < num; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password", salt); // default password

      const user = {
        userName: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        bio: faker.lorem.sentence(),
        profilePic: {
          public_id: "",
          url: faker.image.avatar(),
        },
        isVerified:true,
        status: faker.helpers.arrayElement(["online", "offline"]),
        isAdmin: false,
      };

      users.push(user);
    }

    const created = await User.insertMany(users);
    console.log(`✅ Successfully created ${created.length} fake users`);
  } catch (error) {
    console.error("❌ Error creating users:", error);
  } 
};


createUsers();

