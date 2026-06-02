import { z } from 'zod';

const projectNameSchema = z.string().trim().min(1, '项目名不能为空').max(80, '项目名不能超过 80 个字符');

const currentGoalSchema = z
  .string()
  .trim()
  .min(1, '当前目标不能为空')
  .max(200, '当前目标不能超过 200 个字符');

const nextActionSchema = z
  .string()
  .trim()
  .min(1, '下一步动作不能为空')
  .max(200, '下一步动作不能超过 200 个字符');

const updateContentSchema = z
  .string()
  .trim()
  .min(1, '更新内容不能为空')
  .max(1000, '更新内容不能超过 1000 个字符');

export const projectStatusSchema = z.enum(['IDEA', 'ACTIVE', 'PAUSED', 'DONE']);

export const projectQuickCreateSchema = z.object({
  name: projectNameSchema,
  status: projectStatusSchema,
  nextAction: nextActionSchema,
});

export const projectFilterSchema = z.object({
  status: projectStatusSchema.optional(),
});

export const projectOverviewSchema = z.object({
  name: projectNameSchema,
  status: projectStatusSchema,
  currentGoal: currentGoalSchema,
  nextAction: nextActionSchema,
});

export const projectUpdateEntrySchema = z.object({
  content: updateContentSchema,
});

export type ProjectStatusInput = z.infer<typeof projectStatusSchema>;
export type ProjectQuickCreateInput = z.infer<typeof projectQuickCreateSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
export type ProjectOverviewInput = z.infer<typeof projectOverviewSchema>;
export type ProjectUpdateEntryInput = z.infer<typeof projectUpdateEntrySchema>;
