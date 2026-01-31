import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { dbService, Task } from '@/lib/tracker/db';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const TaskList = ({ userId }: { userId: string | null }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const date = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (userId) {
            setTasks(dbService.getTasks(userId, date));
        }
    }, [userId, date]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !userId) return;

        const task = dbService.addTask({
            user_id: userId,
            text: newTask,
            completed: false,
            date
        });

        setTasks([...tasks, task]);
        setNewTask('');
        toast.success("Task added!");
    };

    const toggleComplete = (taskId: string) => {
        if (!userId) return;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updated = !task.completed;
        const success = dbService.updateTask(taskId, { completed: updated });

        if (success) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: updated } : t));

            if (updated) {
                // Determine XP awarded (Random 10-20)
                const xpGain = Math.floor(Math.random() * 10) + 10;
                const user = dbService.getUser(userId);

                dbService.updateUser(userId, { xp: user.xp + xpGain });

                toast.success(`Completed! +${xpGain} XP`);
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            }
        }
    };

    const deleteTask = (taskId: string) => {
        dbService.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
        toast('Task removed', { icon: '🗑️' });
    };

    return (
        <div className="tracker-card flex-col">
            <div className="flex-between">
                <h2>Today's Focus</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--tr-text-secondary)' }}>
                    {tasks.filter(t => t.completed).length}/{tasks.length} Done
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '150px' }}>
                {tasks.map(task => (
                    <div key={task.id} className="tracker-task-item" style={{ opacity: task.completed ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => toggleComplete(task.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: `2px solid ${task.completed ? 'var(--tr-accent)' : 'var(--tr-border)'}`,
                                    backgroundColor: task.completed ? 'var(--tr-accent)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {task.completed && <Check size={14} strokeWidth={3} />}
                            </button>
                            <span style={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'var(--tr-text-secondary)' : 'var(--tr-text-primary)'
                            }}>
                                {task.text}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTask(task.id)}
                            style={{ opacity: 0.5, padding: '4px' }}
                            className="hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--tr-text-secondary)', fontStyle: 'italic' }}>
                        No tasks yet. Start small!
                    </div>
                )}
            </div>

            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                    type="text"
                    className="tracker-input"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className="tracker-btn" disabled={!newTask.trim()}>
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};

export default TaskList;
