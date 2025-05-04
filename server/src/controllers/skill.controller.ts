import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Skill from "../Models/Skill";

// @desc   Get all skills
// @route  GET /api/skills/
// @access Private
const getAllSkills = asyncHandler(async (req: Request, res: Response) => {
  const skills = await Skill.find();

  res.status(200).json({
    success: true,
    message: "Skills fetched successfully",
    data: skills,
  });
});

// @desc   Get a skill
// @route  GET /api/skills/:id
// @access Private
const getSkill = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.skillId;
  const skill = await Skill.findById(id);

  res.status(200).json({
    success: true,
    message: "Skill fetched successfully",
    data: skill,
  });
});

// @desc   Register a skill
// @route  POST /api/skills/
// @access Private
const registerSkill = asyncHandler(async (req: Request, res: Response) => {
  const { skillName }: { skillName: string } = req.body;

  if (!skillName) {
    throw new Error("Skill name is required!");
  }

  // Check if skill already exists
  const skill = await Skill.findOne({ name: skillName.toLowerCase() });

  if (skill) {
    throw new Error("Skill already exists");
  }

  const skillDoc = await Skill.create({
    name: skillName.toLowerCase(),
  });
  res
    .status(200)
    .json({ success: true, message: "Got skills", data: skillDoc });
});

export { getAllSkills, getSkill, registerSkill };
