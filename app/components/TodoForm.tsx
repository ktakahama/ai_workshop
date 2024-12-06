import { useState } from 'react';

interface TodoFormProps {
  onAdd: (task: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [task, setTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAdd(task);
        setTask('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
          placeholder="新しいタスクを入力..."
          maxLength={100}
        />
        <button
          type="submit"
          disabled={isSubmitting || !task.trim()}
          className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '追加中...' : '追加'}
        </button>
      </div>
      <div className="text-right mt-2 text-white/50 text-sm">
        {task.length}/100文字
      </div>
    </form>
  );
} 