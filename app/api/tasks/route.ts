import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initializeDatabase } from '@/app/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateTasks(goal: string) {
  const prompt = `
目的: "${goal}"
この目的を達成するための具体的なタスクリストを5-7個生成してください。
各タスクには以下の情報を含めてください：
- タスク名
- 優先順位（高、中、低）
- 詳細な説明

以下のJSON形式で出力してください：
{
  "tasks": [
    {
      "task": "タスク名",
      "priority": "優先順位",
      "details": "詳細説明"
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });
  const response = completion.choices[0].message.content;
  if (!response) {
    throw new Error('OpenAIからのレスポンスが空でした');
  }
  return JSON.parse(response);
}

export async function GET() {
  try {
    console.log('GET リクエストを受信しました');
    
    // データベースの初期化を確認
    console.log('データベースの初期化を開始...');
    await initializeDatabase();

    console.log('タスクの取得を開始...');
    const { rows } = await sql`
      SELECT * FROM tasks 
      ORDER BY 
        CASE priority
          WHEN '高' THEN 1
          WHEN '中' THEN 2
          WHEN '低' THEN 3
        END,
        created_at DESC
    `;
    console.log(`${rows.length}件のタスクを取得しました`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('データベースエラー:', error);
    // エラーの詳細情報を出力
    if (error instanceof Error) {
      console.error('エラーの種類:', error.name);
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST リクエストを受信しました');
    
    await initializeDatabase();
    
    const { goal } = await request.json();
    console.log('受信した目的:', goal);
    
    if (!goal) {
      console.log('目的が空でリクエストされました');
      return NextResponse.json(
        { error: '目的を入力してください' },
        { status: 400 }
      );
    }

    console.log('OpenAIでタスク生成を開始...');
    const generatedTasks = await generateTasks(goal);
    console.log('生成されたタスク:', generatedTasks);

    // 生成されたタスクをDBに保存
    const savedTasks = await Promise.all(
      generatedTasks.tasks.map(async (task: { task: string | number | boolean | null | undefined; priority: string | number | boolean | null | undefined; details: string | number | boolean | null | undefined; }) => {
        const { rows } = await sql`
          INSERT INTO tasks (goal, task, priority, details)
          VALUES (${goal}, ${task.task}, ${task.priority}, ${task.details})
          RETURNING *
        `;
        return rows[0];
      })
    );

    return NextResponse.json(savedTasks);
  } catch (error) {
    console.error('タスク生成エラー:', error);
    if (error instanceof Error) {
      console.error('エラーの種類:', error.name);
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
    return NextResponse.json(
      { error: 'タスクの生成と保存に失敗しました' },
      { status: 500 }
    );
  }
} 