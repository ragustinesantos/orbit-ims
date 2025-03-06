import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const userlogin = process.env.EMAIL || '';
const password = process.env.PASSWORD || '';

test.describe.configure({ mode: 'serial' });

test('add item', async ({ page }) => {

  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Type Your Username' }).click();
  await page.getByRole('textbox', { name: 'Type Your Username' }).fill(userlogin);
  await page.getByRole('textbox', { name: 'Type Your Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Type Your Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();
  await page.getByRole('link', { name: 'Add Item' }).click();

  // This step is necessary to make sure the drop down values are already available
  await page.waitForSelector(`text=${userlogin}`);
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Orbit Unique Item');
  await page.getByRole('textbox', { name: 'Package Unit' }).fill('Box');
  await page.getByRole('textbox', { name: 'Unit of Measurement' }).fill('pc');
  await page.getByRole('textbox', { name: 'Supplier/Source' }).click();
  await page.getByRole('option', { name: 'Bright Future Tech' }).click();
  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('option', { name: 'Cleaning Supplies' }).click();

  await page.getByRole('button', { name: 'Submit' }).click();

  // Check if there is a success message from submission
  await expect(page.getByText('Item added')).toBeVisible();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();
  await page.getByRole('link', { name: 'Search Item' }).click();

  // This step is necessary to make sure db query of items is already available
  await page.waitForSelector(`text=${userlogin}`);

  // Check if the item was successfully added to database
  await expect(page.getByRole('cell', { name: 'Orbit Unique Item' })).toBeVisible();

});

test('update item', async ({ page }) => {

  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Type Your Username' }).click();
  await page.getByRole('textbox', { name: 'Type Your Username' }).fill(userlogin);
  await page.getByRole('textbox', { name: 'Type Your Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Type Your Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();

  await page.getByRole('link', { name: 'Update Item' }).click();

  await page.waitForSelector(`text=${userlogin}`);
  await page.getByRole('textbox', { name: 'Search Item' }).click();
  await page.getByRole('textbox', { name: 'Search Item' }).fill('orbit');
  await page.getByRole('option', { name: 'Orbit Unique Item' }).click();

  // Update values of item in form
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Wingkei Important Item');
  await page.getByRole('textbox', { name: 'Package Unit' }).click();
  await page.getByRole('textbox', { name: 'Package Unit' }).fill('dozen');
  await page.getByRole('textbox', { name: 'Unit of Measurement' }).click();
  await page.getByRole('textbox', { name: 'Unit of Measurement' }).fill('bottle');
  await page.getByRole('spinbutton', { name: 'Current Stock' }).click();
  await page.getByRole('spinbutton', { name: 'Current Stock' }).fill('4');
  await page.getByRole('spinbutton', { name: 'Minimum Purchase Quantity' }).click();
  await page.getByRole('spinbutton', { name: 'Minimum Purchase Quantity' }).fill('2');
  await page.getByRole('spinbutton', { name: 'Minimum Storage Quantity' }).click();
  await page.getByRole('spinbutton', { name: 'Minimum Storage Quantity' }).fill('1');
  await page.getByRole('textbox', { name: 'Supplier/Source' }).click();
  await page.getByRole('option', { name: 'Eco Green Industries' }).click();
  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('option', { name: 'Medical Supplies' }).click();

  // Submit update and check if success message appeared
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Item Updated')).toBeVisible();

  await page.getByRole('button', { name: 'Manage Inventory' }).click();
  await page.getByRole('link', { name: 'Search Item' }).click();
  await page.waitForSelector(`text=${userlogin}`);

  //Check that the Orbit Unique Item no longer exists since it was updated 
  await expect(page.getByRole('cell', { name: 'Orbit Unique Item' })).toBeHidden;
  await page.getByRole('textbox', { name: 'Search Item' }).click();
  await page.getByRole('textbox', { name: 'Search Item' }).fill('wingkei');
  await page.getByRole('option', { name: 'Wingkei Important Item' }).click();

  // Check if search reflects correct values for updated item
  await expect(page.getByRole('cell', { name: 'Wingkei Important Item' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '4' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'bottle' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Critical' })).toBeVisible();
});