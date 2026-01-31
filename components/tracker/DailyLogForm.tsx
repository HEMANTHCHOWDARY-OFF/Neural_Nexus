import React, { useState, useEffect } from 'react';
import { Save, BookOpen } from 'lucide-react';
import { dbService } from '@/lib/tracker/db';
import { toast } from 'react-hot-toast';

const DailyLogForm = ({ userId }: { userId: string | null }) => {
    const [mood, setMood] = useState('Neutral');
    const [notes, setNotes] = useState('');
    const date = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (userId) {
            const log = dbService.getDailyLog(userId, date);
            if (log) {
                setMood(log.mood);
                setNotes(log.notes);
            }
        }
    }, [userId, date]);

    const handleSave = () => {
        if (!userId) return;

        dbService.saveDailyLog({
            user_id: userId,
            date,
            mood,
            notes
        });

        // XP Reward for journaling
        const user = dbService.getUser(userId);
        dbService.updateUser(userId, { xp: user.xp + 5 });

        toast.success("Journal saved! +5 XP");
    };

    const moods = ['🔥 Productive', '🙂 Happy', '😐 Neutral', '😫 Tired', '😤 Frustrated'];

    return (
        <div className="tracker-card flex-col">
            <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} className="text-secondary" />
                    <h2>Daily Log</h2>
                </div>
                <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{date}</span>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    How are you feeling?
                </label>
                <div className="mood-selector">
                    {moods.map(m => (
                        <button
                            key={m}
                            onClick={() => setMood(m)}
                            className={`mood-option ${mood === m ? 'selected' : ''}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Notes & Reflections
                </label>
                <textarea
                    className="tracker-textarea"
                    rows={4}
                    placeholder="What did you learn today? What could go better?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button className="tracker-btn" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> Save Log
                </button>
            </div>
        </div>
    );
};

export default DailyLogForm;
