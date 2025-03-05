import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('add item', async ({ page }) => {

  const userlogin = process.env.EMAIL || '';
  const password = process.env.PASSWORD || '';

  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Type Your Username' }).click();
  await page.getByRole('textbox', { name: 'Type Your Username' }).fill(userlogin);
  await page.getByRole('textbox', { name: 'Type Your Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Type Your Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();

  await page.getByRole('link', { name: 'Add Item' }).click();
  await page.waitForSelector('text=test@orbit.wingkei.ca');
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Orbit Unique Item');
  await page.getByRole('textbox', { name: 'Package Unit' }).fill('Box');
  await page.getByRole('textbox', { name: 'Unit of Measurement' }).fill('pc');

  await page.getByRole('textbox', { name: 'Supplier/Source' }).click();
  await page.getByRole('option', { name: 'Bright Future Tech' }).click();

  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('option', { name: 'Cleaning Supplies' }).click();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Item added')).toBeVisible();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();
  await page.getByRole('link', { name: 'Search Item' }).click();
  await page.waitForSelector(`text=${userlogin}`);
  await expect(page.getByRole('cell', { name: 'Orbit Unique Item' })).toBeVisible();

});