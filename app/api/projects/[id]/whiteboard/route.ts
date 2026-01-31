import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET whiteboard data
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const whiteboardRef = doc(collection(db, 'project_whiteboard'), id);
        const whiteboardSnap = await getDoc(whiteboardRef);

        if (!whiteboardSnap.exists()) {
            return NextResponse.json({ drawing_data: [] });
        }

        const data = whiteboardSnap.data();
        return NextResponse.json({
            ...data,
            drawing_data: JSON.parse(data.drawing_data || '[]')
        });
    } catch (error: any) {
        console.error('Error fetching whiteboard:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST save whiteboard data
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { drawing_data } = body;

        const whiteboardRef = doc(collection(db, 'project_whiteboard'), id);
        await setDoc(whiteboardRef, {
            project_id: id,
            drawing_data: JSON.stringify(drawing_data),
            updated_at: Timestamp.now()
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error saving whiteboard:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE whiteboard data
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const whiteboardRef = doc(collection(db, 'project_whiteboard'), id);
        await deleteDoc(whiteboardRef);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting whiteboard:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
