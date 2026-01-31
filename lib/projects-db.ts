import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
export const projectsCollection = collection(db, 'projects');
export const projectFilesCollection = collection(db, 'project_files');
export const projectMembersCollection = collection(db, 'project_members');
export const projectTasksCollection = collection(db, 'project_tasks');
export const projectChatCollection = collection(db, 'project_chat');
export const projectWhiteboardCollection = collection(db, 'project_whiteboard');

// Project operations
export async function createProject(data: {
    id: string;
    title: string;
    description: string;
    owner_id: string;
    tech_stack: string;
}) {
    const projectRef = doc(projectsCollection, data.id);
    await setDoc(projectRef, {
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    });
    return data.id;
}

export async function getProject(projectId: string) {
    const projectRef = doc(projectsCollection, projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
        return { id: projectSnap.id, ...projectSnap.data() };
    }
    return null;
}

export async function getAllProjects() {
    const projectsSnap = await getDocs(projectsCollection);
    const projects = [];

    for (const projectDoc of projectsSnap.docs) {
        const projectData = { id: projectDoc.id, ...projectDoc.data() };

        // Get member count
        const membersQuery = query(projectMembersCollection, where('project_id', '==', projectDoc.id));
        const membersSnap = await getDocs(membersQuery);

        projects.push({
            ...projectData,
            members_count: membersSnap.size
        });
    }

    // Sort by created_at in memory
    projects.sort((a: any, b: any) => {
        const aTime = a.created_at?.toMillis?.() || 0;
        const bTime = b.created_at?.toMillis?.() || 0;
        return bTime - aTime; // Descending order
    });

    return projects;
}

// Project member operations
export async function addProjectMember(data: {
    project_id: string;
    user_id: string;
    role: string;
}) {
    await addDoc(projectMembersCollection, {
        ...data,
        joined_at: Timestamp.now()
    });
}

// File operations
export async function createOrUpdateFile(data: {
    project_id: string;
    filename: string;
    filepath: string;
    language: string;
    content: string;
    user_id: string;
}) {
    // Use filepath as unique identifier
    const fileId = `${data.project_id}_${data.filepath.replace(/\//g, '_')}`;
    const fileRef = doc(projectFilesCollection, fileId);

    await setDoc(fileRef, {
        project_id: data.project_id,
        filename: data.filename,
        filepath: data.filepath,
        language: data.language,
        content: data.content,
        updated_at: Timestamp.now(),
        updated_by: data.user_id
    }, { merge: true });

    return fileId;
}

export async function getProjectFiles(projectId: string) {
    const filesQuery = query(
        projectFilesCollection,
        where('project_id', '==', projectId)
    );
    const filesSnap = await getDocs(filesQuery);

    const files = filesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Sort by filepath in memory
    files.sort((a: any, b: any) => (a.filepath || '').localeCompare(b.filepath || ''));

    return files;
}

export async function deleteFile(projectId: string, filepath: string) {
    const fileId = `${projectId}_${filepath.replace(/\//g, '_')}`;
    const fileRef = doc(projectFilesCollection, fileId);
    await deleteDoc(fileRef);
}

// Whiteboard operations
export async function saveWhiteboard(projectId: string, drawingData: any) {
    const whiteboardRef = doc(projectWhiteboardCollection, projectId);
    await setDoc(whiteboardRef, {
        project_id: projectId,
        drawing_data: JSON.stringify(drawingData),
        updated_at: Timestamp.now()
    }, { merge: true });
}

export async function getWhiteboard(projectId: string) {
    const whiteboardRef = doc(projectWhiteboardCollection, projectId);
    const whiteboardSnap = await getDoc(whiteboardRef);

    if (whiteboardSnap.exists()) {
        const data = whiteboardSnap.data();
        return {
            ...data,
            drawing_data: JSON.parse(data.drawing_data || '[]')
        };
    }
    return null;
}

export async function deleteWhiteboard(projectId: string) {
    const whiteboardRef = doc(projectWhiteboardCollection, projectId);
    await deleteDoc(whiteboardRef);
}

// Task operations
export async function createTask(data: {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: string;
    assigned_to?: string;
}) {
    const taskRef = doc(projectTasksCollection, data.id);
    await setDoc(taskRef, {
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    });
}

export async function getProjectTasks(projectId: string) {
    const tasksQuery = query(
        projectTasksCollection,
        where('project_id', '==', projectId)
    );
    const tasksSnap = await getDocs(tasksQuery);

    const tasks = tasksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Sort by created_at in memory (descending)
    tasks.sort((a: any, b: any) => {
        const aTime = a.created_at?.toMillis?.() || 0;
        const bTime = b.created_at?.toMillis?.() || 0;
        return bTime - aTime;
    });

    return tasks;
}

// Chat operations
export async function sendChatMessage(data: {
    project_id: string;
    user_id: string;
    user_name: string;
    message: string;
}) {
    await addDoc(projectChatCollection, {
        ...data,
        created_at: Timestamp.now()
    });
}

export async function getProjectChat(projectId: string) {
    const chatQuery = query(
        projectChatCollection,
        where('project_id', '==', projectId)
    );
    const chatSnap = await getDocs(chatQuery);

    const messages = chatSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Sort by created_at in memory (ascending)
    messages.sort((a: any, b: any) => {
        const aTime = a.created_at?.toMillis?.() || 0;
        const bTime = b.created_at?.toMillis?.() || 0;
        return aTime - bTime;
    });

    return messages;
}
