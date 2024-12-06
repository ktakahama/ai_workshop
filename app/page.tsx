'use client';

import { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import TaskList from './components/TaskList';

interface Task {
  id: number;
  goal: string;
  task: string;
  priority: string;
  details: string;
  completed: boolean;
  created_at: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('取得したデータ:', data);

      if (Array.isArray(data)) {
        setTasks(data);
        setError('');
      } else {
        console.error('データが配列ではありません:', data);
        setError('データの形式が正しくありません');
        setTasks([]);
      }
    } catch (error) {
      console.error('タスクの取得に失敗しました:', error);
      setError('タスクの取得に失敗しました');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async (goal: string) => {
    try {
      setError('');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'タスクの生成に失敗しました');
      }

      const newTasks = await response.json();
      setTasks(prevTasks => [...newTasks, ...prevTasks]);
    } catch (error) {
      console.error('エラー:', error);
      setError(error instanceof Error ? error.message : 'タスクの生成に失敗しました');
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );

      // Note: 必要に応じて、ここでAPIを呼び出してデータベースを更新することもできます
      // await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
    } catch (error) {
      console.error('タスクの状態更新に失敗しました:', error);
      setError('タスクの状態更新に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-metallic relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(100)].map((_, i) => (
          <div key={i} className="sakura" style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -100}%`,
            animationDelay: `${-Math.random() * 30}s`
          }} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative" style={{ zIndex: 2 }}>
        <h1 className="text-center mb-12">
          <span className="inline-block text-4xl font-medium text-white/90 tracking-[0.25em] mb-3 
            border-b border-white/20 pb-2 px-8">
            心得帳
          </span>
          <span className="block text-sm text-white/60 font-normal tracking-[0.2em] mt-4 
            before:content-['—'] before:mr-4 after:content-['—'] after:ml-4">
            Kokoro no Tobira
          </span>
        </h1>
        {error && (
          <div className="bg-red-500/50 text-white p-4 rounded-lg mb-4 backdrop-blur-lg">
            <p className="font-bold">エラー</p>
            <p>{error}</p>
          </div>
        )}
        <GoalForm onSubmit={handleGoalSubmit} />
        {loading ? (
          <div className="text-white text-center py-8 animate-pulse">
            読み込み中...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTaskCompletion}
          />
        )}
      </div>
    </div>
  );
} 