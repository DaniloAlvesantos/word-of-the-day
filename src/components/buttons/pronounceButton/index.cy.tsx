import { PronounceButton } from "./index";

describe("Speech Synthesis Testing", () => {
  it("should call speechSynthesis.speak when the button is clicked", () => {
    cy.mount(<PronounceButton word="Ephemeral" />);
    const speakSpy = cy.spy(window.speechSynthesis, "speak").as("speakSpy");

    cy.get("button").click();

    cy.get("@speakSpy").should("have.been.called");
  });
});
