import { cookieOptions } from "../../utils/cookieOptions.js";

export const redirectController = async (req, res) => {
  const user = req.user;

  if (!user?.tokens?.accessToken || !user?.tokens?.refreshToken) {
    return res.redirect(`${process.env.FRONT_END_URL}/login?error=true`);
  }

  const redirectURL = `${process.env.Front_END_URL}/google/success?accessToken=${user.tokens.accessToken}`;

  res.cookie("refreshToken", user.tokens.refreshToken, cookieOptions);
  return res.redirect(redirectURL);
};
