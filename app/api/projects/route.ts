import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// GET all projects
export async function GET(request: NextRequest) {
    try {
        const projectsCollection = collection(db, 'projects');
        const projectsSnap = await getDocs(projectsCollection);

        const projects = projectsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by created_at in memory
        projects.sort((a: any, b: any) => {
            const aTime = a.created_at?.toMillis?.() || 0;
            const bTime = b.created_at?.toMillis?.() || 0;
            return bTime - aTime;
        });

        return NextResponse.json(projects);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        // If it's a permission error or similar, return empty array so frontend falls back to demo mode implicitly
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            return NextResponse.json([]);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, owner_id, tech_stack } = body;

        if (!title || !owner_id) {
            return NextResponse.json(
                { error: 'Title and owner_id are required' },
                { status: 400 }
            );
        }

        const projectId = uuidv4();

        // Create project
        const projectRef = doc(collection(db, 'projects'), projectId);
        await setDoc(projectRef, {
            id: projectId,
            title,
            description: description || '',
            owner_id,
            tech_stack: tech_stack || '',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
        });

        // Add owner as member
        await addDoc(collection(db, 'project_members'), {
            project_id: projectId,
            user_id: owner_id,
            role: 'owner',
            joined_at: Timestamp.now()
        });

        // Create default file
        const fileId = `${projectId}__index.js`;
        const fileRef = doc(collection(db, 'project_files'), fileId);
        await setDoc(fileRef, {
            project_id: projectId,
            filename: 'index.js',
            filepath: '/index.js',
            language: 'javascript',
            content: '// Welcome to your new project!\nconsole.log("Hello, World!");',
            updated_at: Timestamp.now(),
            updated_by: owner_id
        });

        return NextResponse.json({ id: projectId, title, description, owner_id, tech_stack }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
