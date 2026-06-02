import { describe, expect, it } from 'vitest';

import {
  projectFilterSchema,
  projectOverviewSchema,
  projectQuickCreateSchema,
  projectUpdateEntrySchema,
} from '@/lib/validators/projects';

describe('projectQuickCreateSchema', () => {
  it('accepts a valid quick-create payload', () => {
    const result = projectQuickCreateSchema.safeParse({
      name: ' Personal System 重构 ',
      status: 'ACTIVE',
      nextAction: ' 完成首页状态总览与列表重构 ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Personal System 重构',
        status: 'ACTIVE',
        nextAction: '完成首页状态总览与列表重构',
      });
    }
  });

  it('rejects blank required fields', () => {
    const result = projectQuickCreateSchema.safeParse({
      name: '   ',
      status: 'ACTIVE',
      nextAction: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported status values', () => {
    const result = projectQuickCreateSchema.safeParse({
      name: 'Test',
      status: 'UNKNOWN',
      nextAction: 'Do something',
    });

    expect(result.success).toBe(false);
  });
});

describe('projectFilterSchema', () => {
  it('accepts an undefined filter', () => {
    const result = projectFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts a supported status filter', () => {
    const result = projectFilterSchema.safeParse({ status: 'PAUSED' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid status filter', () => {
    const result = projectFilterSchema.safeParse({ status: 'ARCHIVED' });
    expect(result.success).toBe(false);
  });
});

describe('projectOverviewSchema', () => {
  it('accepts a valid overview update payload', () => {
    const result = projectOverviewSchema.safeParse({
      name: 'Project Workbench',
      status: 'IDEA',
      currentGoal: '明确项目工作台第一版的产品边界',
      nextAction: '完成 Project 模型与 dashboard 切换',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a blank current goal', () => {
    const result = projectOverviewSchema.safeParse({
      name: 'Project Workbench',
      status: 'IDEA',
      currentGoal: '   ',
      nextAction: '完成 Project 模型与 dashboard 切换',
    });

    expect(result.success).toBe(false);
  });
});

describe('projectUpdateEntrySchema', () => {
  it('accepts a non-empty update entry', () => {
    const result = projectUpdateEntrySchema.safeParse({
      content: '今天确认了首页先保留 UI shell，再继续接 Project 数据。',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a blank update entry', () => {
    const result = projectUpdateEntrySchema.safeParse({ content: '   ' });
    expect(result.success).toBe(false);
  });
});
