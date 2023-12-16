import mongoose, { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto"; // This is built in package is use for hashing password
import { createTokenForUser } from "../services/authentication.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: "./public/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // we can give between this two, otherwise mongoose throws an error
      default: "USER", // default role will be USER
    },
  },
  { timestamps: true }
);

//

// Hasing password before save
userSchema.pre("save", function (next) {
  const user = this; // here 'this' is pointing to the current user

  if (!user.isModified("password")) return;
  //generating the random 16 string
  const salt = randomBytes(16).toString();

  // hashing the password
  const hashedPassword = createHmac("sha256", salt) // 'sha256' is algorithm
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword; //here we are replacing orignal password with hashed password
  next();
});

// making virtual function to match hashedpasswords
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  // now hash the user given password
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect password");

  const token = createTokenForUser(user);
  return token;
});
const User = model("user", userSchema);

export default User;
