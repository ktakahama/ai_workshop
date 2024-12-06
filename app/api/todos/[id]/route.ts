import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM todos WHERE id = ${params.id}`;
    return NextResponse.json({ message: '削除成功' });
  } catch (error) {
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }
} 