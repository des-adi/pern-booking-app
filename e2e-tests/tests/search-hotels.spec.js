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

test("should show hotel detail", async ({page}) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going ?").fill("Delhi");
    await page.getByRole("button", {name: "Search"}).click();

    await page.getByText("The Grand").click();
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", {name: "Book Now"})).toBeVisible();

});

test("should book hotel", async({page}) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going ?").fill("Delhi");
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const formattedDate = date.toISOString().split("T")[0];
    await page.getByPlaceholder("Check-out Date").fill(formattedDate);
    await page.getByRole("button", {name: "Search"}).click();

    await page.getByText("The Grand").click();
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going ?").fill("Delhi");
    await page.getByRole("button", {name: "Search"}).click();

    await page.getByText("The Grand").click();

    await page.getByRole("button", {name: "Book Now"}).click();
    await expect(page.getByText("Total cost: Rs. 9560.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("4242 4242 4242 4242");
    await stripeFrame.locator('[placeholder="MM / YY"]').fill("10/25");
    await stripeFrame.locator('[placeholder="CVC"]').fill("043");
    await stripeFrame.locator('[placeholder="ZIP"]').fill("43244");

    await page.getByRole("button", {name: "Confirm Booking"}).click();
    await expect(page.getByText("Booking Saved")).toBeVisible();
});