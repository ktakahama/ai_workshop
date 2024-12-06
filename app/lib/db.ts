import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        goal TEXT NOT NULL,
        task TEXT NOT NULL,
        priority TEXT CHECK (priority IN ('高', '中', '低')),
        details TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    const { rows } = await sql`SELECT to_regclass('public.tasks');`;
    if (rows[0].to_regclass) {
      console.log('データベースの初期化が完了しました');
      return true;
    } else {
      throw new Error('テーブルの作成に失敗しました');
    }
  } catch (error) {
    console.error('データベースの初期化に失敗しました:', error);
    throw error;
  }
} 