import { useState } from "react";
import api from "../services/api";
import "./MockInterview.css";

function MockInterview() {
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("advanced");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const generateQuestions = async () => {
    try {
      setLoading(true);

      const response = await api.post(
        "/ai/generate-interview",
        {
          role,
          domain,
          company,
          difficulty,
        }
      );

      const text = response.data.data;

      const parsedQuestions = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) =>
          line.replace(/^\d+[\.\)]\s*/, "")
        );

      setQuestions(parsedQuestions);
      setCurrentQuestion(0);
      setFeedback("");
      setAnswer("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to generate interview"
      );
    } finally {
      setLoading(false);
    }
  };

  const evaluate = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer");
      return;
    }

    try {
      setEvaluating(true);

      const response = await api.post(
        "/ai/evaluate-answer",
        {
          question: questions[currentQuestion],
          answer,
        }
      );

      setFeedback(response.data.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to evaluate answer"
      );
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswer("");
      setFeedback("");
    }
  };

  return (

  <div className="mock-page">
    <header className="mock-header">
      <div className="mock-brand">
        <div className="mock-logo">S</div>
        <span>SeniorConnect <strong>AI</strong></span>
      </div>
      <span className="mock-header-label">AI CAREER LAB</span>
    </header>

<main className="mock-main">
  <section className="mock-welcome">
    <span className="mock-eyebrow">YOUR PERSONAL AI INTERVIEWER</span>
    <h1>AI Mock Interview</h1>
    <p>
      Practice real interview questions, improve your answers,
      and get AI-powered feedback to prepare for your dream job.
    </p>
  </section>

  <div className="mock-workspace">
    {questions.length === 0 ? (
      <section className="mock-card mock-setup">
        <div className="mock-card-icon">✦</div>
        <h2>Set up your interview</h2>
        <p className="mock-muted">
          Choose your domain and level to generate focused interview questions.
        </p>

        <form
          className="mock-form"
          onSubmit={(e) => {
            e.preventDefault();
            generateQuestions();
          }}
        >
          <div className="mock-field">
            <label htmlFor="mock-role">Target job role</label>
            <input
              id="mock-role"
              type="text"
              placeholder="e.g. Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="mock-field">
            <label htmlFor="mock-domain">Interview domain</label>
            <input
              id="mock-domain"
              type="text"
              placeholder="e.g. React, Python, Data Science, Cybersecurity"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>

          <div className="mock-field">
            <label htmlFor="mock-difficulty">Question difficulty</label>
            <select
              id="mock-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="mock-field">
            <label htmlFor="mock-company">
              Target company <span>(Optional)</span>
            </label>
            <input
              id="mock-company"
              type="text"
              placeholder="e.g. IBM, TCS, Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <button
            className="mock-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating questions..." : "Start Mock Interview"}
            {!loading && <span>→</span>}
          </button>

          <p className="mock-note">
            ✦ Questions are generated with AI based on your input.
          </p>
        </form>
      </section>
    ) : (
      <section className="mock-card mock-interview">
        <div className="mock-interview-top">
          <div>
            <span className="mock-eyebrow">INTERVIEW IN PROGRESS</span>
            <h2>{role}</h2>
            <p className="mock-muted">{domain} · {difficulty}</p>
            {company && <p className="mock-muted">{company}</p>}
          </div>
          <span className="mock-status">
            <span className="mock-status-dot"></span>
            Practice mode
          </span>
        </div>

        <div className="mock-progress-info">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>

        <div
          className="mock-progress-track"
          role="progressbar"
          aria-valuenow={currentQuestion + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
        >
          <div
            className="mock-progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>

        <div className="mock-question">
          <span className="mock-question-label">YOUR QUESTION</span>
          <h3>{questions[currentQuestion]}</h3>
        </div>

        <div className="mock-field mock-answer-field">
          <label htmlFor="mock-answer">Your answer</label>
          <textarea
            id="mock-answer"
            rows={8}
            placeholder="Explain your approach, share examples, and write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <span className="mock-character-count">
            {answer.length} characters
          </span>
        </div>

        <button
          className="mock-primary-button"
          onClick={evaluate}
          disabled={evaluating || !answer.trim()}
        >
          {evaluating ? "Evaluating your answer..." : "Evaluate My Answer"}
          {!evaluating && <span>✦</span>}
        </button>

        {feedback && (
          <div className="mock-feedback">
            <div className="mock-feedback-heading">
              <div className="mock-feedback-icon">✦</div>
              <div>
                <h3>AI Feedback</h3>
                <p>Review your answer and identify areas to improve.</p>
              </div>
            </div>

            <div className="mock-feedback-content">
              {feedback}
            </div>

            {currentQuestion < questions.length - 1 ? (
              <button
                className="mock-secondary-button"
                onClick={nextQuestion}
              >
                Next Question <span>→</span>
              </button>
            ) : (
              <div className="mock-complete">
                <h3>Interview questions completed!</h3>
                <p>You have reached the last question. Great work!</p>
                <button
                  className="mock-secondary-button"
                  onClick={() => {
                    setQuestions([]);
                    setCurrentQuestion(0);
                    setAnswer("");
                    setFeedback("");
                  }}
                >
                  Start Another Interview
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    )}
  </div>

  <p className="mock-bottom-note">
    Practice makes progress. Use AI feedback to keep improving.
  </p>
</main>


  </div>
);

}

export default MockInterview;