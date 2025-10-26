import { sendEmail } from "../../config/sendEmail.js";
import { OTP } from "../../models/otpSchema.js";
import { User } from "../../models/UserSchema.js";
import { generateOtp } from "../../utils/generateOtp.js";

export const getOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email});

    if (!user) return res.status(404).json({ message: "User not found" });

    await OTP.deleteMany({ user: user._id });
    const otp = generateOtp();

    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    const otpEntry = new OTP({
      user: user._id,
      otp,
      expiresAt: new Date(expires),
    });

    await otpEntry.save();

      await sendEmail({
          to: email,
          subject: `OTP for Dear ${user.userName} `,
          html: `<p>Your One-Time Password (OTP) for account verification is: <b>${otp} </b>. Do not share this OTP with anyone for security reasons</p>

            <p>This OTP is valid for only 5 minutes.
            
            Thank you,
            QUICK CHAT</p>`,
        });
    res
      .status(200)
      .json({ message: `Otp sent to ${email}` });
  } catch (error) {
  
    res
      .status(500)
      .json({ message: "Error occured while sending Otp" });
  }

};
