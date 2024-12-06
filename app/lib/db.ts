import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    console.log('データベース初期化を開始します...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // パスワードを隠してログ出力

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

    // テーブル存在確認のクエリを実行する前にログを出力
    console.log('テーブルの存在を確認中...');
    const { rows } = await sql`SELECT to_regclass('public.tasks');`;
    
    if (rows[0].to_regclass) {
      console.log('データベースの初期化が完了しました');
      // テーブルの構造を確認
      const tableInfo = await sql`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'tasks';
      `;
      console.log('テーブル構造:', tableInfo.rows);
      return true;
    } else {
      throw new Error('テーブルの作成に失敗しました');
    }
  } catch (error) {
    console.error('データベースの初期化に失敗しました:', error);
    // エラーの詳細情報を出力
    if (error instanceof Error) {
      console.error('エラーの種類:', error.name);
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
    throw error;
  }
} 