import React, { useState } from "react";
import * as XLSX from "xlsx";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedQuestions = jsonData.slice(1).map((row, index) => ({
          no: index + 1,
          title: row[0],
          selection: [row[2], row[3], row[4], row[5]],
          answer: row[1] - 1,
        }));

        setQuestions(formattedQuestions);
        setCurrentQuestion(0);
        setScore({ correct: 0, incorrect: 0 });
        setShowAnswer(false);
        setQuizCompleted(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAnswerSelection = (index) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      setShowAnswer(true);
      if (index === questions[currentQuestion].answer) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore({ correct: 0, incorrect: 0 });
    setShowAnswer(false);
    setQuizCompleted(false);
  };

  const handleExit = () => {
    window.open("", "_self").close();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>刷題練習</h1>
      {!quizCompleted && <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />}
      {questions.length > 0 && !quizCompleted && (
        <div>
          <h2>{questions[currentQuestion].title}</h2>
          <ul style={{ listStyle: "none", padding: 0, textAlign: "left", display: "inline-block", fontSize: "20px" }}>
            {questions[currentQuestion].selection.map((option, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  display: "flex",
                  alignItems: "center",
                  background: selectedAnswer !== null ? (index === questions[currentQuestion].answer ? "lightgreen" : (index === selectedAnswer ? "salmon" : "white")) : "white",
                  cursor: selectedAnswer === null ? "pointer" : "default",
                }}
                onClick={() => handleAnswerSelection(index)}
              >
                <span style={{ marginRight: "10px", fontSize: "24px" }}>
                  {showAnswer && index === questions[currentQuestion].answer ? "✔️" : showAnswer && index === selectedAnswer ? "❌" : ""}
                </span>
                {option}
              </li>
            ))}
          </ul>
          {showAnswer && (
            <div>
              <button onClick={handleNextQuestion} style={{ padding: "10px", marginTop: "20px" }}>
                {currentQuestion < questions.length - 1 ? "下一題" : "結束測驗"}
              </button>
            </div>
          )}
          <p>進度: {currentQuestion + 1} / {questions.length}</p>
        </div>
      )}
      {quizCompleted && (
        <div>
          <h2>測驗結束</h2>
          <p>答對題數: {score.correct}</p>
          <p>答錯題數: {score.incorrect}</p>
          <button onClick={handleRestart} style={{ padding: "10px", margin: "10px" }}>練習下一個檔案</button>
          <button onClick={handleExit} style={{ padding: "10px", margin: "10px" }}>離開答題系統</button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
