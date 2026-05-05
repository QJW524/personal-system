import { z } from 'zod';

const usernameSchema = z
  .string()
  .trim()
  .min(3, '用户名至少 3 个字符')
  .max(24, '用户名不能超过 24 个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名仅支持字母、数字和下划线');

const emailSchema = z.string().trim().email('邮箱格式不正确').transform((value) => value.toLowerCase());

const passwordSchema = z.string().min(8, '密码至少 8 位').max(64, '密码不能超过 64 位');

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, '请输入用户名或邮箱'),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
