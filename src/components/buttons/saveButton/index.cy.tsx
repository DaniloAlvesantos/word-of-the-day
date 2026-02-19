import { SaveButton } from "./index";

describe("SaveButton", () => {
  it("should render the SaveButton component", () => {
    cy.mount(<SaveButton word="test" />);
    cy.get("button").should("be.visible");
    cy.contains("Save to list").should("be.visible");
  });

  it("should toggle the saved state when the button is clicked", () => {
    cy.mount(<SaveButton word="test" />);
    cy.get("button").click();
    cy.get("button").find("svg").should("have.class", "fill-current");

    cy.get("button").click();
    cy.get("button").find("svg").should("have.class", "fill-none");
  });
});

describe("LocalStorage", () => {
  it("should save the word to localStorage when the button is clicked", () => {
    cy.mount(<SaveButton word="test" />);
    cy.get("button").click();
    cy.window().its("localStorage").should("have.property", "savedWords");
    cy.window().its("localStorage.savedWords").should("contain", "test");
  });
});
