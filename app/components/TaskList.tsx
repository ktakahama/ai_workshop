interface Task {
  id: number;
  goal: string;
  task: string;
  priority: string;
  details: string;
  completed: boolean;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
}

export default function TaskList({ tasks, onToggle }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高': return 'bg-red-500/20';
      case '中': return 'bg-yellow-500/20';
      case '低': return 'bg-blue-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg backdrop-blur-lg transition-all ${
            task.completed ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="w-5 h-5 rounded border-white/50 bg-transparent"
              />
              <span className="text-white font-medium">{task.task}</span>
            </div>
            <span className={`px-2 py-1 rounded text-sm text-white ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <div className="ml-9">
            <p className="text-white/70 text-sm">{task.details}</p>
            <p className="text-white/50 text-xs mt-2">
              目的: {task.goal}
            </p>
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-white/50 text-center py-8">
          タスクがありません
        </div>
      )}
    </div>
  );
} 