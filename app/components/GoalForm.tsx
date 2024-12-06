import { useState } from 'react';

interface GoalFormProps {
  onSubmit: (goal: string) => Promise<void>;
}

export default function GoalForm({ onSubmit }: GoalFormProps) {
  const [goal, setGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(goal);
        setGoal('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 rounded-lg bg-white/80 backdrop-blur-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 min-h-[100px]"
          placeholder="目的を入力してください（例：引越しの準備）"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={isSubmitting || !goal.trim()}
          className="px-6 py-3 bg-white/80 hover:bg-white/90 backdrop-blur-lg rounded-lg text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'タスク生成中...' : 'タスクを生成'}
        </button>
      </div>
      <div className="text-right mt-2 text-white/80 text-sm">
        {goal.length}/200文字
      </div>
    </form>
  );
} 