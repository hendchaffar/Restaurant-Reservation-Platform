import { FaRobot } from "react-icons/fa";

const QuestionOptions = ({ actions }: any) => {
  const questions = [
    { id: 1, msg: "How can I make a reservation?" },
    { id: 2, msg: "How do I add meals to my cart?" },
    { id: 3, msg: "Can I modify my reservation?" },
    { id: 4, msg: "What are the available restaurants?" },
    { id: 5, msg: "How can I cancel a reservation?" },
    { id: 6, msg: "How do I checkout?" },
  ];

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="flex gap-1">
          <button
            onClick={() => actions.handleQuestion(question.msg)}
            className="bg-white text-sm text-black p-2 rounded-full border border-black hover:bg-slate-300 shadow-md drop-shadow-md mb-2"
          >
            {question.msg}
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuestionOptions;


