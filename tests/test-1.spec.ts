import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Type Your Username' }).click();
  await page.getByRole('textbox', { name: 'Type Your Username' }).fill('');
  await page.getByRole('textbox', { name: 'Type Your Password' }).click();
  await page.getByRole('textbox', { name: 'Type Your Password' }).fill('');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Manage Inventory' }).click();
  await page.getByRole('link', { name: 'Add Item' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Laptop');
  await page.getByRole('textbox', { name: 'Item Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Package Unit' }).fill('per box');
  await page.getByRole('textbox', { name: 'Package Unit' }).press('Tab');
  await page.getByRole('textbox', { name: 'Unit of Measurement' }).fill('pc');
  await page.getByRole('textbox', { name: 'Supplier/Source' }).click();
  await page.getByText('Bright Future Tech').click();
  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('option', { name: 'Cleaning Supplies' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Item Added!').click();
});

