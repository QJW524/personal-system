import { expect, test } from '@playwright/test';

import { cleanupE2EUser } from './helpers/cleanup-e2e-user';
import { createE2ETestUser } from './helpers/test-user';

test('redirects unauthenticated users and completes the auth + highlight journey', async ({
  page,
}) => {
  const user = createE2ETestUser();
  let userCreated = false;
  const createdTitle = `E2E Created ${user.username}`;
  const createdSummary = 'Playwright creates a highlight in the shared development database.';
  const editedTitle = `E2E Edited ${user.username}`;
  const editedSummary = 'Playwright updates the temporary highlight before cleanup.';

  try {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);

    await page.getByRole('button', { name: '新用户注册' }).click();
    await page.getByLabel('用户名').fill(user.username);
    await page.getByLabel('邮箱').fill(user.email);
    await page.getByLabel('密码').fill(user.password);
    await page.getByRole('button', { name: '注册账号' }).click();

    await expect(page.getByText('注册成功，请直接登录。')).toBeVisible();
    userCreated = true;

    await page.getByLabel('用户名或邮箱').fill(user.username);
    await page.getByLabel('密码').fill(user.password);
    await page.getByRole('button', { name: '登录并进入首页' }).click();

    await expect(page).toHaveURL('http://localhost:3001/');
    await expect(page.getByText(`${user.username} · ${user.email}`)).toBeVisible();

    await page.getByPlaceholder('标题，例如：完成后台重构').fill(createdTitle);
    await page.getByPlaceholder('一句话描述你最近在做什么').fill(createdSummary);
    await page.getByRole('button', { name: '新增' }).click();

    await expect(page.getByText('新增成功。')).toBeVisible();
    await expect(page.getByRole('heading', { name: createdTitle })).toBeVisible();
    await expect(page.getByText(createdSummary)).toBeVisible();

    const item = page.locator('li').filter({ hasText: createdTitle });
    await item.getByRole('button', { name: '编辑' }).click();
    const editingItem = page.locator('li').filter({
      has: page.getByRole('button', { name: '保存' }),
    });
    await editingItem.locator('input').fill(editedTitle);
    await editingItem.locator('textarea').fill(editedSummary);
    await editingItem.getByRole('button', { name: '保存' }).click();

    await expect(page.getByText('更新成功。')).toBeVisible();
    await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible();
    await expect(page.getByText(editedSummary)).toBeVisible();

    const editedItem = page.locator('li').filter({ hasText: editedTitle });
    await editedItem.getByRole('button', { name: '删除' }).click();

    await expect(page.getByText('删除成功。')).toBeVisible();
    await expect(page.getByRole('heading', { name: editedTitle })).toHaveCount(0);

    await page.getByRole('button', { name: '退出登录' }).click();
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);

    await page.goto('/');
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  } finally {
    const cleanupResult = await cleanupE2EUser(user.username);
    if (userCreated) {
      expect(cleanupResult.count).toBe(1);
    }
  }
});
