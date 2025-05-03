import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import axios from "axios";
import User from "../Models/User";
import jwt from "jsonwebtoken";

const REDIRECT_URI = "http://localhost:8000/api/auth/callback/google";

const FRONTEND_URL = "http://localhost:3000";

const oAuthLogin = asyncHandler((req: Request, res: Response) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar.events",
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
});

const oAuthCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

  try {
    // Get tokens from Google
    const { data: tokenResponse } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token, id_token, refresh_token } = tokenResponse;

    // Decode Google ID token to get profile
    const { data: profile } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { sub: googleId, email, name, picture } = profile;

    // Store or update user
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture,
        accessToken: access_token,
        refreshToken: refresh_token,
      });
    } else {
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      await user.save();
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true, // set true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(FRONTEND_URL);
  } catch (error) {
    console.error("OAuth error", error);
    res.status(500).send("Authentication failed");
  }
});

export { oAuthLogin, oAuthCallback };
