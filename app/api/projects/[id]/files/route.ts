import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET project files
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Mock data for demo projects
        if (id.startsWith('demo-')) {
            const demoFiles = [
                {
                    id: `${id}_index`,
                    filename: 'index.js',
                    filepath: '/index.js',
                    language: 'javascript',
                    content: id.includes('resume')
                        ? '// AI Resume Screener\nimport { OpenAI } from "openai";\n\nconst screener = new OpenAI();\nconsole.log("Initializing screener...");'
                        : '// Crypto Trading Bot\nimport { WebSocket } from "ws";\n\nconst ws = new WebSocket("wss://api.crypto.com");\nws.on("open", () => console.log("Connected to liquidity pool"));'
                },
                {
                    id: `${id}_utils`,
                    filename: 'utils.js',
                    filepath: '/utils.js',
                    language: 'javascript',
                    content: 'export const formatCurrency = (val) => `$${val.toFixed(2)}`;'
                }
            ];
            return NextResponse.json(demoFiles);
        }

        const filesQuery = query(
            collection(db, 'project_files'),
            where('project_id', '==', id)
        );
        const filesSnap = await getDocs(filesQuery);

        const files = filesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by filepath
        files.sort((a: any, b: any) => (a.filepath || '').localeCompare(b.filepath || ''));

        return NextResponse.json(files);
    } catch (error: any) {
        console.error('Error fetching files:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create/update file
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { filename, filepath, language, content, user_id } = body;

        if (!filepath || !user_id) {
            return NextResponse.json(
                { error: 'Filepath and user_id are required' },
                { status: 400 }
            );
        }

        const fileId = `${id}_${filepath.replace(/\//g, '_')}`;
        const fileRef = doc(collection(db, 'project_files'), fileId);

        await setDoc(fileRef, {
            project_id: id,
            filename,
            filepath,
            language: language || 'plaintext',
            content: content || '',
            updated_at: Timestamp.now(),
            updated_by: user_id
        }, { merge: true });

        return NextResponse.json({
            id: fileId,
            project_id: id,
            filename,
            filepath,
            language,
            content
        });
    } catch (error: any) {
        console.error('Error saving file:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE file
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const filepath = searchParams.get('filepath');

        if (!filepath) {
            return NextResponse.json(
                { error: 'Filepath is required' },
                { status: 400 }
            );
        }

        const fileId = `${id}_${filepath.replace(/\//g, '_')}`;
        const fileRef = doc(collection(db, 'project_files'), fileId);
        await deleteDoc(fileRef);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
