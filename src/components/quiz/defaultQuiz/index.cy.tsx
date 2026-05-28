import { mockQuizData } from "../../../../cypress/fixtures/quiz";
import { DefaultQuiz } from "./index";

describe("Quiz Testing", () => {
  const selectors = {
    cardTitle: '[class*="@container/card-header"]',
    optionBtn: 'button[variant="outline"]',
    nextBtn: 'button:contains("Next Challenge")',
    finishBtn: 'button:contains("Finish Experience")',
    explanation: "#quizExplanation",
  };

  it("Should render the first question", () => {
    cy.mount(<DefaultQuiz quizData={mockQuizData} />);

    cy.get(selectors.cardTitle).should("contain", "Quick Quiz");
    cy.contains(mockQuizData.questions[0].text).should("be.visible");

    mockQuizData.questions[0].options.forEach((question) => {
      cy.contains(question).should("be.visible");
    });

    cy.get(selectors.nextBtn).should("not.be.enabled");
  });

  it("Should handle a correct answer", () => {
    const firstQuiz = mockQuizData.questions[0];
    cy.mount(<DefaultQuiz quizData={mockQuizData} />);

    cy.contains(firstQuiz.answer).click();
    cy.get(selectors.explanation).should("be.visible");
    cy.get(selectors.explanation).should("contain", "Correct!");
    cy.get(selectors.nextBtn).should("be.enabled");
  });

  it("Should handle a incorrect answer", () => {
    const firstQuiz = mockQuizData.questions[0];
    const wrongAnswer = firstQuiz.options.find(
      (option) => option !== firstQuiz.answer,
    );
    cy.mount(<DefaultQuiz quizData={mockQuizData} />);

    cy.contains(wrongAnswer!).click();
    cy.get(selectors.explanation).should("be.visible");
    cy.get(selectors.explanation).should("contain", "Context & Nuance:");
    cy.get(selectors.nextBtn).should("be.enabled");
  });

  it("Should transition the entrie quiz to the finish state", () => {
    cy.mount(<DefaultQuiz quizData={mockQuizData} />);

    for (let i = 0; i < mockQuizData.questions.length - 1; i++) {
      cy.contains(`Question ${i + 1} of`).should("be.visible");
      cy.contains(mockQuizData.questions[i].answer).click();
      cy.get(selectors.nextBtn).click();
    }

    const lastIndex = mockQuizData.questions.length - 1;
    cy.contains(`Question ${lastIndex + 1} of`).should("be.visible");
    cy.contains(mockQuizData.questions[lastIndex].answer).click();

    cy.get(selectors.finishBtn).should("be.visible").and("not.be.enabled"); // change to: not.be.disabled
  });
});
