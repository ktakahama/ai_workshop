interface Todo {
  id: number;
  task: string;
  created_at: string;
  completed?: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle?: (id: number) => void;
}

export default function TodoList({ todos, onDelete, onToggle }: TodoListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-lg transition-all ${
            todo.completed 
              ? 'bg-green-500/20 line-through' 
              : 'bg-white/20'
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle?.(todo.id)}
              className="w-5 h-5 rounded border-white/50 bg-transparent"
            />
            <span className="text-white">{todo.task}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-white/50 text-sm">
              {new Date(todo.created_at).toLocaleDateString('ja-JP')}
            </span>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-4 py-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-white transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      ))}
      {todos.length === 0 && (
        <div className="text-white/50 text-center py-8">
          タスクがありません
        </div>
      )}
    </div>
  );
} 