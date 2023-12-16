import JWT from "jsonwebtoken";
const secret = "blogify03#";

export const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
};

export const validateToken = (token) => {
  const payload = JWT.verify(token, secret);
  return payload;
};
