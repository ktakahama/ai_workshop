import { useState } from 'react';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 10;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高': return 'bg-red-500/20';
      case '中': return 'bg-yellow-500/20';
      case '低': return 'bg-blue-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const goal = task.goal;
    if (!groups[goal]) {
      groups[goal] = [];
    }
    groups[goal].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // 全てのグループのタスクを1つの配列にフラット化
  const allTasks = Object.values(groupedTasks).flat();

  // 現在のページのタスクを取得
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = allTasks.slice(indexOfFirstTask, indexOfLastTask);

  // 現在のタスクを目的ごとに再グループ化
  const currentGroupedTasks = currentTasks.reduce((groups, task) => {
    const goal = task.goal;
    if (!groups[goal]) {
      groups[goal] = [];
    }
    groups[goal].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const pageCount = Math.ceil(allTasks.length / tasksPerPage);

  // 達成率の計算
  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const totalProgress = calculateProgress(allTasks);

  return (
    <div>
      <div className="flex justify-center mb-12">
        <div className="relative w-32 h-32">
          {/* 背景の円 */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              className="stroke-white/10"
              strokeWidth="6"
              fill="none"
            />
            {/* プログレス円 */}
            <circle
              cx="64"
              cy="64"
              r="60"
              className="stroke-white/60"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - totalProgress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          {/* 中央のテキスト */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-medium text-white/90">{totalProgress}</span>
            <span className="text-sm text-white/60 tracking-wider mt-1">達成率</span>
          </div>
        </div>
        {/* 装飾的な要素 */}
        <div className="absolute -z-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      </div>

      <div className="space-y-8">
        {Object.entries(currentGroupedTasks).map(([goal, goalTasks]) => (
          <div key={goal} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white/80 text-xl font-medium ml-2 border-l-2 border-white/20 pl-3">
                {goal}
              </h2>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/40 rounded-full transition-all"
                    style={{ width: `${calculateProgress(goalTasks)}%` }}
                  ></div>
                </div>
                <span className="text-sm">{calculateProgress(goalTasks)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              {goalTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg backdrop-blur-lg transition-all border border-white/10 
                    bg-[#faf8f5]/20 ${task.completed ? 'opacity-50' : ''
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
                      <span className="text-white font-medium text-base">{task.task}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="ml-9">
                    <p className="text-white/70 text-xs">{task.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white/80 hover:text-white disabled:text-white/30 transition-colors"
          >
            ＜
          </button>

          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${currentPage === i + 1
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              <span className="text-sm">{i + 1}</span>
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className="px-4 py-2 text-white/80 hover:text-white disabled:text-white/30 transition-colors"
          >
            ＞
          </button>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-white/50 text-center py-8">
          タスクがありません
        </div>
      )}
    </div>
  );
} 