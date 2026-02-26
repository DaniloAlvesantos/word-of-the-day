import { mockQuizData } from "../../../../cypress/fixtures/quiz";
import { DefaultQuiz } from "./index";

describe("Quiz Testing", () => {
  it("Should render the component", () => {
    cy.mount(<DefaultQuiz quizData={mockQuizData} />);
  });
});
