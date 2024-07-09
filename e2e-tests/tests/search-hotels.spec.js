const {test, expect} = require('@playwright/test');
const UI_URL = "http://localhost:5173/";
const path = require('path');


test.beforeEach(async({page}) => {
    await page.goto(UI_URL);
  
    //get the sign in button
    await page.getByRole("link", {name: "Sign In"}).click();
  
    //page is visible
    await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
  
    //fill in the form data
    await page.locator("[name=email]").fill("mstarc56@gmail.com");
    await page.locator('[name=password]').fill("clutchgod");
  
    //login
    await page.getByRole("button", {name: "Login"}).click();
  
    //toast
    await expect(page.getByText("Sign in successful")).toBeVisible();
  
});

test("should show search hotel results", async ({page}) => {
    await page.goto(UI_URL);
    await page.getByPlaceholder("Where are you going ?").fill("Leh");
    await page.getByRole("button", {name: "Search"}).click();

    await expect(page.getByText("hotels found in Leh")).toBeVisible();
    await expect(page.getByText("Sangto Palace")).toBeVisible();
});