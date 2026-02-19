import { PronounceButton } from "./index";

const isCI = process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS;

describe("Speech Synthesis Testing", () => {
  const testFunc = isCI ? it.skip : it;

  testFunc("should call speechSynthesis.speak when the button is clicked", () => {
    cy.mount(<PronounceButton word="Ephemeral" />);
    
    cy.window().then((win) => {
      cy.spy(win.speechSynthesis, "speak").as("speakSpy");
    });

    cy.get("button").click();
    cy.get("@speakSpy").should("have.been.called");
  });
});