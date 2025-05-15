import User from "../Models/User";

export const getSafeUsers = async () => {
  return await User.find({}, "-accessToken -refreshToken -googleId")
    .populate("profile.skills.skill")
    .exec();
};
