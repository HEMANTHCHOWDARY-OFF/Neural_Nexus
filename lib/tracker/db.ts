// Local Database Service (Mimics "MySQL Lite" / Firestore)
// Uses LocalStorage for persistence

const TASKS_KEY = 'nexus_tasks';
const LOGS_KEY = 'nexus_logs';
const USERS_KEY = 'nexus_users';

export interface Task {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    date: string;
}

export interface DailyLog {
    id: string;
    user_id: string;
    date: string;
    mood: string;
    notes: string;
}

export interface User {
    id: string;
    xp: number;
    streak: number;
    longest_streak: number;
    level: string;
}

const getStore = <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const setStore = <T>(key: string, data: T[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};

const notifySubscribers = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('nexus_update'));
    }
};

export const dbService = {
    // --- TASKS OPERATIONS ---

    getTasks: (userId: string, date?: string): Task[] => {
        const tasks = getStore<Task>(TASKS_KEY);
        if (date) {
            return tasks.filter(t => t.user_id === userId && t.date === date);
        }
        return tasks.filter(t => t.user_id === userId);
    },

    addTask: (task: Omit<Task, 'id'>): Task => {
        const tasks = getStore<Task>(TASKS_KEY);
        const newTask = { ...task, id: Date.now().toString() };
        tasks.push(newTask);
        setStore(TASKS_KEY, tasks);
        notifySubscribers();
        return newTask;
    },

    updateTask: (taskId: string, updates: Partial<Task>): boolean => {
        const tasks = getStore<Task>(TASKS_KEY);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            setStore(TASKS_KEY, tasks);
            notifySubscribers();
            return true;
        }
        return false;
    },

    deleteTask: (taskId: string) => {
        const tasks = getStore<Task>(TASKS_KEY);
        const newTasks = tasks.filter(t => t.id !== taskId);
        setStore(TASKS_KEY, newTasks);
        notifySubscribers();
    },

    // --- DAILY LOG OPERATIONS ---

    getDailyLog: (userId: string, date: string): DailyLog | null => {
        const logs = getStore<DailyLog>(LOGS_KEY);
        return logs.find(l => l.user_id === userId && l.date === date) || null;
    },

    saveDailyLog: (logData: Omit<DailyLog, 'id'>): boolean => {
        const logs = getStore<DailyLog>(LOGS_KEY);
        const index = logs.findIndex(l => l.user_id === logData.user_id && l.date === logData.date);

        if (index !== -1) {
            // Update
            logs[index] = { ...logs[index], ...logData };
            setStore(LOGS_KEY, logs);
        } else {
            // Create
            const newLog = { ...logData, id: Date.now().toString() };
            logs.push(newLog);
            setStore(LOGS_KEY, logs);

            // --- STREAK LOGIC ---
            const user = dbService.getUser(logData.user_id);

            // Calculate Yesterday
            const today = new Date(logData.date);
            const yesterdayDate = new Date(today);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

            // Check if user has a log for yesterday
            const yesterdayLog = logs.find(l => l.user_id === logData.user_id && l.date === yesterdayStr);

            let newStreak = 1;
            if (yesterdayLog) {
                newStreak = (user.streak || 0) + 1;
            }

            const updates: Partial<User> = { streak: newStreak };

            // Update Longest Streak
            if (newStreak > (user.longest_streak || 0)) {
                updates.longest_streak = newStreak;
            }

            dbService.updateUser(logData.user_id, updates);
        }
        notifySubscribers();
        return true;
    },

    getRecentLogs: (userId: string, limit = 7): DailyLog[] => {
        const logs = getStore<DailyLog>(LOGS_KEY);
        // Filter by user, Sort by date descending, then Take limit
        return logs
            .filter(l => l.user_id === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit)
            .reverse(); // Return chronological for charts
    },

    // --- USERS OPERATIONS ---

    getUser: (userId: string): User => {
        const users = getStore<User>(USERS_KEY);
        let user = users.find(u => u.id === userId);
        if (!user) {
            user = {
                id: userId,
                xp: 0,
                streak: 0,
                longest_streak: 0,
                level: 'Seed'
            };
            users.push(user);
            setStore(USERS_KEY, users);
        }
        return user;
    },

    updateUser: (userId: string, updates: Partial<User>): User | null => {
        const users = getStore<User>(USERS_KEY);
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            setStore(USERS_KEY, users);
            notifySubscribers();
            return users[index];
        }
        return null;
    }
};
