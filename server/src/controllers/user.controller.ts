import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserType } from "../Models/User";
import { asyncHandler } from "../utils/asyncHandler";

// @desc   Get logged in user
// @route  GET /api/user/me
// @access Private
const getLoggedInUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || !user._id) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const userInfo = await User.findById(user._id)
    .select("-accessToken -refreshToken -googleId")
    .populate([
      { path: "profile.skills.skill" },
      { path: "profile.experience.techStack" },
      { path: "profile.projects.techStack" },
    ])
    .exec();

  if (!userInfo) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User found",
    data: userInfo,
  });
});

// @desc   Get user profile
// @route  GET /api/user/:id
// @access Public
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Search for user in the DB
  const user = await User.findById(id)
    .select("-accessToken -refreshToken -googleId")
    .populate("profile.skills.skill")
    .exec();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, message: "User found", data: user });
});

// @desc   Edit user profile
// @route  PUT /api/user/me
// @access Private
const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const {
    linkedInUrl,
    bio,
    totalYoe,
    leetcodeUrl,
    githubUrl,
    skills,
  }: {
    linkedInUrl: string;
    bio: string;
    totalYoe: number;
    leetcodeUrl: string;
    githubUrl: string;
    skills: { id: string; yoe: number }[];
  } = req.body;
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const userDoc: UserType = await User.findById(user.id).select(
    "-accessToken -googleId -refreshToken"
  );

  if (!userDoc) {
    throw new Error("User not found");
  }

  if (skills && skills.length > 0) {
    const exisitingSkills = new Set(
      userDoc.profile?.skills.map((s) => s.skill.toString())
    );
    const skillToAdd = skills
      .filter((skill) => !exisitingSkills.has(skill.id))
      .map((s) => ({ skill: new mongoose.Types.ObjectId(s.id), yoe: s.yoe }));
    if (skillToAdd.length > 0) userDoc.profile.skills.push(...skillToAdd);
  }

  if (linkedInUrl) {
    userDoc.profile.linkedInUrl = linkedInUrl;
  }

  if (bio) {
    userDoc.profile.bio = bio;
  }

  if (totalYoe) {
    userDoc.profile.totalYoe = totalYoe;
  }

  if (leetcodeUrl) {
    userDoc.profile.leetcodeUrl = leetcodeUrl;
  }

  if (githubUrl) {
    userDoc.profile.githubUrl = githubUrl;
  }

  await userDoc.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: userDoc,
  });
});

// @desc   Add Experience
// @route  POST /api/user/me/experience
// @access Private
const addExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const {
    companyName,
    role,
    from,
    to,
    currentlyWorking,
    techStack,
    description,
  }: {
    companyName: string;
    role: string;
    from: Date;
    to: Date;
    currentlyWorking: boolean;
    techStack: string[];
    description: string;
  } = req.body;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  const techStackToSave = techStack.map(
    (stack) => new mongoose.Types.ObjectId(stack)
  );

  const experience = {
    companyName,
    role,
    from: new Date(from),
    to: to ? new Date(to) : null,
    currentlyWorking,
    description,
    techStack: techStackToSave,
  };

  userDoc.profile.experience.push(experience);

  await userDoc.save();

  res.status(200).json({
    success: true,
    message: "Experience added successfully",
    data: experience,
  });
});

// @desc   Delete Experience
// @route  Delete /api/user/me/experience/:experienceId
// @access Private
const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { experienceId } = req.params;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  const experienceArrayLengthBeforeDelete = userDoc.profile.experience.length;

  userDoc.profile.experience = userDoc.profile.experience.filter(
    (exp) => exp._id?.toString() !== experienceId
  );

  if (experienceArrayLengthBeforeDelete === userDoc.profile.experience.length) {
    res.json(404);
    throw new Error("Experience not found!");
  }

  userDoc.save();

  res.status(200).json({
    success: true,
    message: "Experience deleted successfully",
    data: userDoc.profile.experience,
  });
});

// @desc   Edit Experience
// @route  PUT /api/user/me/experience/:experienceId
// @access Private
const editExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { experienceId } = req.params;

  const {
    companyName,
    role,
    from,
    to,
    currentlyWorking,
    techStack,
    description,
  }: {
    companyName: string;
    role: string;
    from: Date;
    to: Date;
    currentlyWorking: boolean;
    techStack: string[];
    description: string;
  } = req.body;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  let experience = userDoc.profile.experience.find(
    (exp) => exp._id?.toString() === experienceId
  );

  if (!experience) {
    res.json(404);
    throw new Error("Experience not found!");
  }

  if (companyName !== undefined) experience.companyName = companyName;
  if (role !== undefined) experience.role = role;
  if (from !== undefined) experience.from = new Date(from);
  if (to !== undefined) experience.to = new Date(to);
  if (currentlyWorking !== undefined)
    experience.currentlyWorking = currentlyWorking;
  if (description !== undefined) experience.description = description;
  if (techStack && techStack.length > 0) {
    experience.techStack = techStack.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
  }

  userDoc.save();

  res.status(200).json({
    success: true,
    message: "Experience edited successfully",
    data: experience,
  });
});

// @desc   Add Experience
// @route  POST /api/user/me/project
// @access Private
const addProject = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const {
    name,
    from,
    to,
    techStack,
    deployedProjectLink,
    githubRepoLink,
    description,
  }: {
    name: string;
    from: Date;
    to: Date;
    techStack: string[];
    deployedProjectLink: string;
    githubRepoLink: string;
    description: string;
  } = req.body;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  const techStackToSave = techStack.map(
    (stack) => new mongoose.Types.ObjectId(stack)
  );

  const project = {
    name,
    from: new Date(from),
    to: new Date(to),
    techStack: techStackToSave,
    deployedProjectLink,
    githubRepoLink,
    description,
  };

  userDoc.profile.projects.push(project);

  await userDoc.save();

  res.status(200).json({
    success: true,
    message: "Project added successfully",
    data: project,
  });
});

// @desc   Delete Project
// @route  Delete /api/user/me/project/:projectId
// @access Private
const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { projectId } = req.params;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  const projectsArrayLengthBeforeDelete = userDoc.profile.projects.length;

  userDoc.profile.projects = userDoc.profile.projects.filter(
    (project) => project._id?.toString() !== projectId
  );

  if (projectsArrayLengthBeforeDelete === userDoc.profile.projects.length) {
    res.json(404);
    throw new Error("Project not found!");
  }

  userDoc.save();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    data: userDoc.profile.projects,
  });
});

// @desc   Edit Project
// @route  PUT /api/user/me/experience/:projectId
// @access Private
const editProject = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { projectId } = req.params;

  const {
    name,
    from,
    to,
    techStack,
    deployedProjectLink,
    githubRepoLink,
    description,
  }: {
    name: string;
    from: Date;
    to: Date;
    techStack: string[];
    deployedProjectLink: string;
    githubRepoLink: string;
    description: string;
  } = req.body;

  const userDoc: UserType | null = await User.findById(user.id);

  if (!userDoc) {
    throw new Error("User not found");
  }

  let project = userDoc.profile.projects.find(
    (proj) => proj._id?.toString() === projectId
  );

  if (!project) {
    res.json(404);
    throw new Error("Project not found!");
  }

  if (name !== undefined) project.name = name;
  if (from !== undefined) project.from = new Date(from);
  if (to !== undefined) project.to = new Date(to);
  if (techStack && techStack.length > 0) {
    project.techStack = techStack.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (deployedProjectLink !== undefined)
    project.deployedProjectLink = deployedProjectLink;
  if (githubRepoLink !== undefined) project.githubRepoLink = githubRepoLink;
  if (description !== undefined) project.description = description;

  userDoc.save();

  res.status(200).json({
    success: true,
    message: "Project edited successfully",
    data: project,
  });
});

export {
  editUserProfile,
  getUserProfile,
  getLoggedInUser,
  addExperience,
  deleteExperience,
  editExperience,
  addProject,
  deleteProject,
  editProject,
};
