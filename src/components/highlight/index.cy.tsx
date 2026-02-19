import { Highlight } from "./index";

describe("Highlight", () => {
  it("Should render the text with the word highlighted", () => {
    const text = "This is a test string.";
    const wordToHighlight = "test";
    cy.mount(<Highlight text={text} wordToHighlight={wordToHighlight} />);
    cy.get("u").should("have.text", wordToHighlight);
  });

  it("Should render the text without highlighting if the word is not found", () => {
    const text = "This is a test string.";
    const wordToHighlight = "notfound";
    cy.mount(<Highlight text={text} wordToHighlight={wordToHighlight} />);
    cy.get("u").should("not.exist");
  });
});
