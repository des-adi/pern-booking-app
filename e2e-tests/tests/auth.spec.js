// @ts-check
const { test, expect } = require('@playwright/test');
const UI_URL = "http://localhost:5173/";
test('should allow the browser to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  
  //get the sign in button
  await page.getByRole("link", {name: "Sign In"}).click();

  //page is visible
  await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();

  //fill in the form data
  await page.locator("[name=email]").fill("1@gmail.com");
  await page.locator('[name=password]').fill("passwords");

  //login
  await page.getByRole("button", {name: "Login"}).click();

  //toast
  await expect(page.getByText("Sign in successful")).toBeVisible();

  //buttons and links
  await page.getByRole("link", {name: "My Bookings"}).click();
  await page.getByRole("link", {name: "My Hotels"}).click();
  await page.getByRole("button", {name: "Sign Out"}).click();

});

test('should allow user to register', async ({ page }) => {

  const testEmail = `test_register_${(Math.random()*90000)+10000}@test.com`;
  await page.goto(UI_URL);

  // Click the Sign In link.
  await page.getByRole('link', { name: 'Sign In' }).click();

    // Click the Create Account link.
    await page.getByRole('link', { name: 'Create an account here' }).click();

  // Expects page to have a heading with the name of Create an account.
  await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();

  //fields
  await page.locator('[name=firstName]').fill('test_firstName');
  await page.locator('[name=lastName]').fill('test_lastName');
  await page.locator('[name=email]').fill(testEmail);
  await page.locator('[name=password]').fill('test_password');
  await page.locator('[name=confirmPassword]').fill('test_password');

  //button
  await page.getByRole('button', {name: 'Create Account'}).click();

  //toast
  await expect(page.getByText("Registration Successful")).toBeVisible();

  //buttons and links
  await page.getByRole("link", {name: "My Bookings"}).click();
  await page.getByRole("link", {name: "My Hotels"}).click();
  await page.getByRole("button", {name: "Sign Out"}).click();
});
