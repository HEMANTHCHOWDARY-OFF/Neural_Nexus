'use client';

import React, { useState } from 'react';
import {
    FileText, Plus, Trash2, Printer, RefreshCw,
    FileText as FileIcon, Download, Wand2,
    ChevronDown, ChevronUp, Github, Linkedin, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

// --- Types ---

interface BulletPointItem {
    id: string;
    text: string;
}

interface SkillCategory {
    id: string;
    category: string;
    skills: string; // Comma separated string for easier editing, or we can split later
}

interface WorkExperience {
    id: string;
    jobTitle: string;
    company: string;
    location: string; // City, Country
    duration: string;
    responsibilities: BulletPointItem[];
}

interface Project {
    id: string;
    title: string;
    technologies: string;
    duration: string;
    outcomes: BulletPointItem[];
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    duration: string; // Graduation Year / Duration
    cgpa: string;
}

interface PersonalInfo {
    fullName: string;
    address: string; // City, Country mainly
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
}

interface ResumeData {
    personalInfo: PersonalInfo;
    skills: SkillCategory[];
    workExperience: WorkExperience[];
    projects: Project[];
    education: Education[];
    certifications: BulletPointItem[];
    achievements: BulletPointItem[];
    languages: string; // simpler as string or list
    references: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_DATA: ResumeData = {
    personalInfo: {
        fullName: '',
        address: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        website: '',
        summary: ''
    },
    skills: [{ id: generateId(), category: 'Programming Languages', skills: 'JavaScript, TypeScript, Python, Java' }],
    workExperience: [{
        id: generateId(),
        jobTitle: '',
        company: '',
        location: '',
        duration: '',
        responsibilities: [{ id: generateId(), text: '' }]
    }],
    projects: [{
        id: generateId(),
        title: '',
        technologies: '',
        duration: '',
        outcomes: [{ id: generateId(), text: '' }]
    }],
    education: [{
        id: generateId(),
        degree: '',
        institution: '',
        duration: '',
        cgpa: ''
    }],
    certifications: [],
    achievements: [],
    languages: '',
    references: ''
};

const ResumeBuilder = () => {
    const [formData, setFormData] = useState<ResumeData>(INITIAL_DATA);
    const [activeSection, setActiveSection] = useState<string | null>('header');

    // --- State Management Helpers ---

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    // Generic updater for array-based sections with ID
    const updateItem = (section: keyof ResumeData, id: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).map((item: any) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addItem = (section: keyof ResumeData, newItem: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...(prev[section] as any[]), newItem]
        }));
    };

    const removeItem = (section: keyof ResumeData, id: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).filter((item: any) => item.id !== id)
        }));
    };

    // Special handlers for nested bullet points (Responsibilities, Outcomes)
    const addBullet = (section: 'workExperience' | 'projects', parentId: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === parentId) {
                    const listKey = section === 'workExperience' ? 'responsibilities' : 'outcomes';
                    // @ts-ignore
                    return { ...item, [listKey]: [...item[listKey], { id: generateId(), text: '' }] };
                }
                return item;
            })
        }));
    };

    const removeBullet = (section: 'workExperience' | 'projects', parentId: string, bulletId: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === parentId) {
                    const listKey = section === 'workExperience' ? 'responsibilities' : 'outcomes';
                    // @ts-ignore
                    return { ...item, [listKey]: item[listKey].filter((b: any) => b.id !== bulletId) };
                }
                return item;
            })
        }));
    };

    const updateBullet = (section: 'workExperience' | 'projects', parentId: string, bulletId: string, text: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === parentId) {
                    const listKey = section === 'workExperience' ? 'responsibilities' : 'outcomes';
                    // @ts-ignore
                    return { ...item, [listKey]: item[listKey].map((b: any) => b.id === bulletId ? { ...b, text } : b) };
                }
                return item;
            })
        }));
    };

    // Simple list handlers (Certifications, Achievements)
    const addSimpleItem = (section: 'certifications' | 'achievements') => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: generateId(), text: '' }]
        }));
    };

    // Helper to update simple item text
    const updateSimpleItem = (section: 'certifications' | 'achievements', id: string, text: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, text } : item)
        }));
    };


    const resetForm = () => {
        if (confirm('Are you sure you want to clear the form?')) {
            setFormData(INITIAL_DATA);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- DOCX Generation ---

    const generateDocx = async () => {
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        // Header
                        new Paragraph({
                            text: formData.personalInfo.fullName.toUpperCase(),
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 }
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 300 },
                            children: [
                                new TextRun(`${formData.personalInfo.email} | ${formData.personalInfo.phone}`),
                                new TextRun({ text: ` | ${formData.personalInfo.address}`, break: 0 }),
                                formData.personalInfo.linkedin ? new TextRun({ text: ` | LinkedIn`, break: 0 }) : new TextRun(""),
                            ],
                        }),

                        // Summary
                        ...(formData.personalInfo.summary ? [
                            new Paragraph({
                                text: "PROFESSIONAL SUMMARY",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 200, after: 100 }
                            }),
                            new Paragraph({ text: formData.personalInfo.summary })
                        ] : []),

                        // Skills
                        ...(formData.skills.length > 0 ? [
                            new Paragraph({
                                text: "SKILLS",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 400, after: 100 }
                            }),
                            ...formData.skills.map(skill => new Paragraph({
                                children: [
                                    new TextRun({ text: `${skill.category}: `, bold: true }),
                                    new TextRun(skill.skills)
                                ]
                            }))
                        ] : []),

                        // Experience
                        ...(formData.workExperience.length > 0 ? [
                            new Paragraph({
                                text: "WORK EXPERIENCE",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 400, after: 100 }
                            }),
                            ...formData.workExperience.flatMap(exp => [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: exp.company, bold: true, size: 24 }),
                                        new TextRun({ text: `\t${exp.location}`, bold: false }) // Tabs might work if configured, simpler without
                                    ]
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: exp.jobTitle, italics: true }),
                                        new TextRun({ text: `  |  ${exp.duration}` })
                                    ],
                                    spacing: { after: 100 }
                                }),
                                ...exp.responsibilities.map(r => new Paragraph({
                                    text: r.text,
                                    bullet: { level: 0 },
                                    spacing: { after: 50 }
                                }))
                            ])
                        ] : []),

                        // Projects
                        ...(formData.projects.length > 0 ? [
                            new Paragraph({
                                text: "PROJECTS",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 400, after: 100 }
                            }),
                            ...formData.projects.flatMap(proj => [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: proj.title, bold: true }),
                                        new TextRun({ text: `  |  ${proj.technologies}`, italics: true })
                                    ]
                                }),
                                ...proj.outcomes.map(o => new Paragraph({
                                    text: o.text,
                                    bullet: { level: 0 }
                                }))
                            ])
                        ] : []),

                        // Education
                        ...(formData.education.length > 0 ? [
                            new Paragraph({
                                text: "EDUCATION",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 400, after: 100 }
                            }),
                            ...formData.education.map(edu => new Paragraph({
                                children: [
                                    new TextRun({ text: `${edu.institution}`, bold: true }),
                                    new TextRun({ text: `\n${edu.degree} | ${edu.duration}` }),
                                    edu.cgpa ? new TextRun({ text: ` | CGPA: ${edu.cgpa}` }) : new TextRun("")
                                ]
                            }))
                        ] : []),
                    ]
                }]
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
            toast.success("Resume downloaded as DOCX!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate DOCX. Please try again.");
        }
    };

    // --- Mock AI Enhance ---
    const handleAIEnhance = () => {
        toast('AI Enhancement would run here! Configured to improve professional summary.', {
            icon: '✨',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        // In a real implementation: Call valid API with summary text
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
            {/* Left Sidebar - Editor */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">

                {/* Scrollable Form Container */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20">

                    {/* Header Controls */}
                    <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm sticky top-0 z-10">
                        <h2 className="font-bold text-lg">Editor</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={resetForm} className="text-muted-foreground">
                                <RefreshCw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-start gap-3 text-sm border border-yellow-200">
                        <FileIcon className="w-5 h-5 shrink-0" />
                        <p>AI Disclaimer: AI powered tool may make mistakes or give unexpected answers. Use as guidance, not advice.</p>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="text-xl font-semibold text-primary mb-2">Header / Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" placeholder="Full Name *" value={formData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
                            <input className="input-field" placeholder="Phone Number *" value={formData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
                            <input className="input-field" placeholder="Email *" value={formData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
                            <input className="input-field" placeholder="Location (City, Country)" value={formData.personalInfo.address} onChange={e => updatePersonalInfo('address', e.target.value)} />
                            <input className="input-field" placeholder="LinkedIn URL" value={formData.personalInfo.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} />
                            <input className="input-field" placeholder="GitHub / Portfolio URL" value={formData.personalInfo.github} onChange={e => updatePersonalInfo('github', e.target.value)} />
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Professional Summary</h3>
                            <Button size="sm" variant="ghost" className="text-purple-600" onClick={handleAIEnhance}>
                                <Wand2 className="w-4 h-4 mr-2" /> AI Enhance
                            </Button>
                        </div>
                        <textarea
                            className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px] resize-y"
                            placeholder="Briefly describe your professional background, key skills, and career goals..."
                            value={formData.personalInfo.summary}
                            onChange={e => updatePersonalInfo('summary', e.target.value)}
                        />
                    </div>

                    {/* Skills */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Skills</h3>
                            <Button size="sm" onClick={() => addItem('skills', { id: generateId(), category: '', skills: '' })} variant="outline">
                                <Plus className="w-4 h-4" /> Add Category
                            </Button>
                        </div>
                        {formData.skills.map((skill, index) => (
                            <div key={skill.id} className="flex gap-2 items-start group">
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    <input className="input-field col-span-1" placeholder="Category (e.g. Languages)" value={skill.category} onChange={e => updateItem('skills', skill.id, 'category', e.target.value)} />
                                    <input className="input-field col-span-2" placeholder="Skills (comma separated)" value={skill.skills} onChange={e => updateItem('skills', skill.id, 'skills', e.target.value)} />
                                </div>
                                <button onClick={() => removeItem('skills', skill.id)} className="p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Work Experience */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Work Experience</h3>
                            <Button size="sm" onClick={() => addItem('workExperience', {
                                id: generateId(), jobTitle: '', company: '', location: '', duration: '', responsibilities: [{ id: generateId(), text: '' }]
                            })} variant="outline">
                                <Plus className="w-4 h-4" /> Add Job
                            </Button>
                        </div>
                        {formData.workExperience.map((exp, index) => (
                            <div key={exp.id} className="p-4 rounded-lg bg-accent/20 border space-y-3 relative group">
                                <div className="absolute top-2 right-2">
                                    <button onClick={() => removeItem('workExperience', exp.id)} className="text-muted-foreground hover:text-red-500 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pr-8">
                                    <input className="input-field" placeholder="Job Title" value={exp.jobTitle} onChange={e => updateItem('workExperience', exp.id, 'jobTitle', e.target.value)} />
                                    <input className="input-field" placeholder="Company Name" value={exp.company} onChange={e => updateItem('workExperience', exp.id, 'company', e.target.value)} />
                                    <input className="input-field" placeholder="Location" value={exp.location} onChange={e => updateItem('workExperience', exp.id, 'location', e.target.value)} />
                                    <input className="input-field" placeholder="Duration (e.g. Jan 2022 - Present)" value={exp.duration} onChange={e => updateItem('workExperience', exp.id, 'duration', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Responsibilities</div>
                                    {exp.responsibilities.map(resp => (
                                        <div key={resp.id} className="flex gap-2 items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                                            <input className="input-field flex-1 text-sm py-1" placeholder="Responsibility / Achievement" value={resp.text} onChange={e => updateBullet('workExperience', exp.id, resp.id, e.target.value)} />
                                            <button onClick={() => removeBullet('workExperience', exp.id, resp.id)} className="text-muted-foreground hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => addBullet('workExperience', exp.id)}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Bullet
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Projects */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Projects</h3>
                            <Button size="sm" onClick={() => addItem('projects', {
                                id: generateId(), title: '', technologies: '', duration: '', outcomes: [{ id: generateId(), text: '' }]
                            })} variant="outline">
                                <Plus className="w-4 h-4" /> Add Project
                            </Button>
                        </div>
                        {formData.projects.map((proj, index) => (
                            <div key={proj.id} className="p-4 rounded-lg bg-accent/20 border space-y-3 relative">
                                <div className="absolute top-2 right-2">
                                    <button onClick={() => removeItem('projects', proj.id)} className="text-muted-foreground hover:text-red-500 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                    <input className="input-field" placeholder="Project Title" value={proj.title} onChange={e => updateItem('projects', proj.id, 'title', e.target.value)} />
                                    <input className="input-field" placeholder="Technologies Used" value={proj.technologies} onChange={e => updateItem('projects', proj.id, 'technologies', e.target.value)} />
                                    <input className="input-field md:col-span-2" placeholder="Duration / Link" value={proj.duration} onChange={e => updateItem('projects', proj.id, 'duration', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Outcomes / Details</div>
                                    {proj.outcomes.map(out => (
                                        <div key={out.id} className="flex gap-2 items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                                            <input className="input-field flex-1 text-sm py-1" placeholder="Project detail..." value={out.text} onChange={e => updateBullet('projects', proj.id, out.id, e.target.value)} />
                                            <button onClick={() => removeBullet('projects', proj.id, out.id)} className="text-muted-foreground hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => addBullet('projects', proj.id)}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Bullet
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Education</h3>
                            <Button size="sm" onClick={() => addItem('education', { id: generateId(), degree: '', institution: '', duration: '', cgpa: '' })} variant="outline">
                                <Plus className="w-4 h-4" /> Add Education
                            </Button>
                        </div>
                        {formData.education.map((edu, index) => (
                            <div key={edu.id} className="p-4 rounded-lg bg-accent/20 border grid grid-cols-2 gap-3 relative group">
                                <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <input className="input-field" placeholder="Degree / Course" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} />
                                <input className="input-field" placeholder="Institution Name" value={edu.institution} onChange={e => updateItem('education', edu.id, 'institution', e.target.value)} />
                                <input className="input-field" placeholder="Year / Duration" value={edu.duration} onChange={e => updateItem('education', edu.id, 'duration', e.target.value)} />
                                <input className="input-field" placeholder="CGPA / Grade" value={edu.cgpa} onChange={e => updateItem('education', edu.id, 'cgpa', e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* Certifications & Awards (Simple Lists) */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Certifications / Training</h3>
                            <Button size="sm" onClick={() => addSimpleItem('certifications')} variant="outline"><Plus className="w-4 h-4" /></Button>
                        </div>
                        {formData.certifications.map(item => (
                            <div key={item.id} className="flex gap-2 items-center">
                                <input className="input-field flex-1" placeholder="Certification Name" value={item.text} onChange={e => updateSimpleItem('certifications', item.id, e.target.value)} />
                                <button onClick={() => removeItem('certifications', item.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-primary">Achievements</h3>
                            <Button size="sm" onClick={() => addSimpleItem('achievements')} variant="outline"><Plus className="w-4 h-4" /></Button>
                        </div>
                        {formData.achievements.map(item => (
                            <div key={item.id} className="flex gap-2 items-center">
                                <input className="input-field flex-1" placeholder="Achievement Description" value={item.text} onChange={e => updateSimpleItem('achievements', item.id, e.target.value)} />
                                <button onClick={() => removeItem('achievements', item.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Right Side - Preview */}
            <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden bg-slate-900/5 rounded-xl border">
                {/* Action Bar */}
                <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
                    <span className="font-semibold text-gray-700">Live Preview</span>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                            <Printer className="w-4 h-4" /> PDF
                        </Button>
                        <Button onClick={generateDocx} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Download className="w-4 h-4" /> DOCX
                        </Button>
                    </div>
                </div>

                {/* Preview Paper */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-slate-950 flex justify-center">
                    <div className="bg-white text-gray-900 w-[210mm] min-h-[297mm] shadow-xl p-[20mm] text-[10pt] leading-normal font-serif">

                        {/* Preview Header */}
                        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                            <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{formData.personalInfo.fullName || 'YOUR NAME'}</h1>
                            <div className="flex flex-wrap justify-center gap-x-3 text-sm text-gray-600">
                                {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                                {formData.personalInfo.phone && <span>| {formData.personalInfo.phone}</span>}
                                {formData.personalInfo.address && <span>| {formData.personalInfo.address}</span>}
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-3 text-sm text-gray-600 mt-1">
                                {formData.personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {formData.personalInfo.linkedin}</span>}
                                {formData.personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {formData.personalInfo.github}</span>}
                                {formData.personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {formData.personalInfo.website}</span>}
                            </div>
                        </div>

                        {/* Preview Sections */}
                        {formData.personalInfo.summary && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Professional Summary</h2>
                                <p className="text-justify">{formData.personalInfo.summary}</p>
                            </div>
                        )}

                        {formData.skills.length > 0 && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Skills</h2>
                                <div className="space-y-1">
                                    {formData.skills.map(skill => (
                                        <div key={skill.id} className="flex">
                                            <span className="font-bold w-40 shrink-0">{skill.category}:</span>
                                            <span>{skill.skills}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.workExperience.length > 0 && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Work Experience</h2>
                                <div className="space-y-4">
                                    {formData.workExperience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between font-bold">
                                                <span>{exp.company}</span>
                                                <span className="font-normal">{exp.location}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="italic">{exp.jobTitle}</span>
                                                <span className="text-sm">{exp.duration}</span>
                                            </div>
                                            <ul className="list-disc ml-5 space-y-0.5">
                                                {exp.responsibilities.map(r => r.text && (
                                                    <li key={r.id}>{r.text}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.projects.length > 0 && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
                                <div className="space-y-3">
                                    {formData.projects.map(proj => (
                                        <div key={proj.id}>
                                            <div className="flex justify-between">
                                                <span>
                                                    <span className="font-bold">{proj.title}</span>
                                                    {proj.technologies && <span className="italic"> | {proj.technologies}</span>}
                                                </span>
                                                <span className="text-sm">{proj.duration}</span>
                                            </div>
                                            <ul className="list-disc ml-5 space-y-0.5">
                                                {proj.outcomes.map(o => o.text && (
                                                    <li key={o.id}>{o.text}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.education.length > 0 && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
                                <div className="space-y-2">
                                    {formData.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between">
                                            <div>
                                                <div className="font-bold">{edu.institution}</div>
                                                <div className="italic">{edu.degree}</div>
                                                {edu.cgpa && <div className="text-sm">CGPA: {edu.cgpa}</div>}
                                            </div>
                                            <div className="text-sm">{edu.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(formData.certifications.length > 0 || formData.achievements.length > 0) && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Certifications & Achievements</h2>
                                <ul className="list-disc ml-5 space-y-0.5">
                                    {formData.certifications.map(c => c.text && <li key={c.id}>{c.text}</li>)}
                                    {formData.achievements.map(a => a.text && <li key={a.id}>{a.text}</li>)}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
