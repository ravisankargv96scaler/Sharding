import React, { useState } from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "Which sharding strategy helps prevent 'hotspots' when User IDs are generated sequentially?",
    options: ["Range Based Sharding", "Hash Based Sharding", "Directory Based Sharding"],
    answer: 1 // Index
  },
  {
    id: 2,
    question: "What happens when a query does NOT include the Shard Key?",
    options: ["The router rejects it", "It goes to a random shard", "Scatter-Gather (Queries all shards)"],
    answer: 2
  },
  {
    id: 3,
    question: "Does sharding usually simplify or complicate application logic?",
    options: ["Simplify", "Complicate", "No change"],
    answer: 1
  }
];

const QuizTab: React.FC = () => {
  const [selections, setSelections] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newSelections = [...selections];
    newSelections[qIndex] = optionIndex;
    setSelections(newSelections);
  };

  const score = selections.reduce((acc, sel, idx) => acc + (sel === questions[idx].answer ? 1 : 0), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Final Knowledge Check</h2>
        <p className="text-slate-400">Test your understanding of Database Sharding.</p>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">{qIdx + 1}. {q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                let statusClass = "border-slate-600 hover:bg-slate-700";
                
                if (submitted) {
                    if (oIdx === q.answer) statusClass = "border-green-500 bg-green-900/20 text-green-400";
                    else if (selections[qIdx] === oIdx && oIdx !== q.answer) statusClass = "border-red-500 bg-red-900/20 text-red-400";
                    else statusClass = "border-slate-700 opacity-50";
                } else {
                    if (selections[qIdx] === oIdx) statusClass = "border-blue-500 bg-blue-900/20 text-blue-400";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${statusClass}`}
                  >
                    <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {submitted && oIdx === q.answer && <CheckCircle size={20} />}
                        {submitted && selections[qIdx] === oIdx && oIdx !== q.answer && <XCircle size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center">
        {!submitted ? (
            <button 
                onClick={() => setSubmitted(true)}
                disabled={selections.includes(-1)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg text-lg transition-all"
            >
                Submit Answers
            </button>
        ) : (
            <div className="text-center animate-in zoom-in fade-in duration-500">
                <div className="text-4xl mb-4">
                    {score === 3 ? '🏆' : score === 2 ? '🥈' : '📚'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                    You scored {score} / 3
                </h3>
                <p className="text-slate-400">
                    {score === 3 ? "Perfect! You're a sharding expert." : "Good effort! Review the sections to master the concepts."}
                </p>
                <button 
                    onClick={() => { setSubmitted(false); setSelections([-1,-1,-1]); }}
                    className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                    Try Again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;