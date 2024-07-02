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

test("should allow the user to add a hotel", async({page}) => {
    await page.goto(`${UI_URL}add-hotel`);
    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("Test Description");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]',"3");
    await page.getByText("Budget").click();
    await page.getByLabel("Free WiFi").click();
    await page.getByLabel("Parking").click();
    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("1");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "1.png"),
        path.join(__dirname, "files", "2.png"),
        path.join(__dirname, "files", "3.png"),
    ]);
    await page.getByRole("button",{name: "Save"}).click();
    await expect(page.getByText('Hotel Saved')).toBeVisible({timeout: 10000});
});

test("should display hotels", async ({page}) => {
    await page.goto(`${UI_URL}my-hotels`);
    await expect(page.getByText("Melbourne's Grand")).toBeVisible();
    await expect(page.getByText("Expensive and exquisite.")).toBeVisible();
    await expect(page.getByText("Melbourne, Australia")).toBeVisible();
    await expect(page.getByText("Luxury")).toBeVisible();
    await expect(page.getByText("3 adults, 1 children")).toBeVisible();
    await expect(page.getByText("5 Star Rating")).toBeVisible();
    await expect(page.getByRole("link", {name: "View Details"})).toBeVisible();
    await expect(page.getByRole("link", {name: "Add Hotel"})).toBeVisible();

});