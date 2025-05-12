import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';



export async function GET() {
    return NextResponse.json({ message: 'Hello World' });
}

export async function POST() {
    return NextResponse.json({ error: 'Method POST Not Allowed' }, { status: 405 });
}
