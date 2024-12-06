import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // データベースの初期化を確認
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // データを取得
    const { rows } = await sql`
      SELECT * FROM todos 
      ORDER BY created_at DESC
    `;

    console.log('取得したデータ:', rows); // デバッグ用ログ
    return NextResponse.json(rows);
  } catch (error) {
    console.error('データベースエラー:', error);
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { task } = await request.json();
    if (!task || typeof task !== 'string') {
      return NextResponse.json(
        { error: '無効なタスクデータです' },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO todos (task)
      VALUES (${task})
      RETURNING *
    `;

    console.log('追加したタスク:', rows[0]); // デバッグ用ログ
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('データベースエラー:', error);
    return NextResponse.json(
      { error: 'タスクの追加に失敗しました' },
      { status: 500 }
    );
  }
} 