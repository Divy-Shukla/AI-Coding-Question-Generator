import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Code2,
    Terminal,
    History,
    BarChart3,
    Settings,
    Menu,
    X,
    Moon,
    Sun,
    Search,
    Bell,
    User,
    ChevronRight,
    Play,
    Send,
    Trophy,
    Flame,
    Star,
    CheckCircle2,
    AlertCircle,
    Clock,
    Cpu,
    Database,
    ChevronDown,
    Sparkles,
    Zap
} from 'lucide-react';
import {
    motion,
    AnimatePresence
} from 'framer-motion';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import Editor from '@monaco-editor/react';

// --- MOCK DATA ---

const MOCK_STATS = {
    totalAttempted: 154,
    successRate: 78,
    avgTime: '2.4ms',
    xp: 4500,
    streak: 12,
    level: 15
};

const MOCK_ACTIVITY = [
    { id: 1, type: 'submission', problem: 'Binary Search', status: 'Passed', time: '2 mins ago' },
    { id: 2, type: 'achievement', problem: '7 Day Streak!', status: 'Unlocked', time: '1 hour ago' },
    { id: 3, type: 'submission', problem: 'Matrix Rotation', status: 'Failed', time: '3 hours ago' },
    { id: 4, type: 'submission', problem: 'Quick Sort', status: 'Passed', time: '5 hours ago' },
];

const MOCK_DIFFICULTY_CHART = [
    { name: 'Easy', count: 45, color: '#10b981' },
    { name: 'Medium', count: 82, color: '#f59e0b' },
    { name: 'Hard', count: 27, color: '#f43f5e' },
];

const MOCK_PERFORMANCE_DATA = [
    { date: 'Mon', score: 65, time: 1.2 },
    { date: 'Tue', score: 72, time: 1.1 },
    { date: 'Wed', score: 68, time: 1.4 },
    { date: 'Thu', score: 85, time: 0.9 },
    { date: 'Fri', score: 78, time: 1.0 },
    { date: 'Sat', score: 92, time: 0.7 },
    { date: 'Sun', score: 88, time: 0.8 },
];

const MOCK_TOPICS = [
    'Loops', 'Functions', 'OOP', 'Recursion', 'DSA', 'Algorithms'
];

const GENERATED_QUESTION_DATA = {
    title: "Efficient Matrix Traversal",
    difficulty: "Medium",
    problem: "Given an n x m matrix, return all elements of the matrix in spiral order. This is a classic coding challenge that tests your ability to manage boundary conditions and iterative logic.",
    inputFormat: "A 2D list of integers `matrix` where 1 <= matrix.length, matrix[0].length <= 100.",
    outputFormat: "A single list of integers containing the elements in spiral order.",
    constraints: [
        "matrix.length == m",
        "matrix[i].length == n",
        "1 <= m, n <= 10",
        "-100 <= matrix[i][j] <= 100"
    ],
    example: {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]"
    },
    hint: "Think about maintaining four boundaries: top, bottom, left, and right. Iterate through each boundary and shrink it until the entire matrix is covered."
};

// --- UTILS & COMPONENTS ---

const Badge = ({ children, variant = 'neutral' }) => {
    const styles = {
        neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
            {children}
        </span>
    );
};

const Card = ({ children, className = '', hover = false }) => (
    <motion.div
        whileHover={hover ? { y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const AnimatedCounter = ({ value, duration = 1.5 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMiliseconds = duration * 1000;
        let incrementTime = totalMiliseconds / end;

        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md ${className}`} />
);

const Toast = ({ message, type = 'success', onClose }) => (
    <motion.div
        initial={{ opacity: 0, x: 50, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-700 dark:text-emerald-100' :
            'bg-indigo-50/90 border-indigo-200 text-indigo-800 dark:bg-indigo-900/90 dark:border-indigo-700 dark:text-indigo-100'
            }`}
    >
        {type === 'success' ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
            <X size={14} />
        </button>
    </motion.div>
);

const ConfettiEffect = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        opacity: 0,
                        x: (Math.random() - 0.5) * 1000,
                        y: (Math.random() - 0.5) * 1000,
                        rotate: Math.random() * 720,
                    }}
                    transition={{
                        duration: 2.5,
                        ease: "circOut"
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'][i % 5],
                    }}
                />
            ))}
        </div>
    );
};

// --- MAIN PAGES ---

const Dashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back, Developer!</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Track your progress and keep up the coding streak.</p>
                </div>
                <div className="flex gap-4">
                    <Card className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 border-none shadow-indigo-200 dark:shadow-none">
                        <Flame className="text-white fill-white" size={18} />
                        <span className="text-white font-bold">{MOCK_STATS.streak} Day Streak</span>
                    </Card>
                    <Card className="px-4 py-2 flex items-center gap-2">
                        <Trophy className="text-amber-500" size={18} />
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">Level {MOCK_STATS.level}</span>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Attempted', value: MOCK_STATS.totalAttempted, icon: Code2, color: 'text-indigo-500' },
                    { label: 'Success Rate', value: `${MOCK_STATS.successRate}%`, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Avg Execution', value: MOCK_STATS.avgTime, icon: Clock, color: 'text-amber-500' },
                    { label: 'Experience Point', value: MOCK_STATS.xp, icon: Zap, color: 'text-violet-500' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6" hover>
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <Badge variant="success">+12%</Badge>
                        </div>
                        <h3 className="text-zinc-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                        </p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Difficulty Distribution</h2>
                        <div className="flex gap-4">
                            {MOCK_DIFFICULTY_CHART.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs text-zinc-500">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_DIFFICULTY_CHART} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {MOCK_DIFFICULTY_CHART.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {MOCK_ACTIVITY.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <div className={`mt-1 p-2 rounded-full ${activity.status === 'Passed' ? 'bg-emerald-100 text-emerald-600' :
                                    activity.status === 'Unlocked' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {activity.type === 'submission' ? <Terminal size={14} /> : <Trophy size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{activity.problem}</p>
                                    <p className="text-xs text-zinc-500">{activity.status} • {activity.time}</p>
                                </div>
                                <ChevronRight size={14} className="text-zinc-400" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-xl transition-all">
                        View All History
                    </button>
                </Card>
            </div>
        </motion.div>
    );
};

const QuestionGenerator = () => {
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [topic, setTopic] = useState('Loops');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState(null);
    const [hintOpen, setHintOpen] = useState(false);

    const generateQuestion = () => {
        setLoading(true);
        setQuestion(null);
        setTimeout(() => {
            setQuestion(GENERATED_QUESTION_DATA);
            setLoading(false);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6 pb-12"
        >
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI Python Question Generator</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Select your preferences and let our AI build a custom challenge for you.</p>
            </div>

            <Card className="p-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed border-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Difficulty Level</label>
                        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${difficulty === d
                                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-white'
                                        : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Target Topic</label>
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        >
                            {MOCK_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            onClick={generateQuestion}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating challenge...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                    Generate Python Question
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Card>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <Card className="p-8 space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {question && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{question.title}</h2>
                                <Badge variant={question.difficulty === 'Advanced' ? 'error' : 'warning'}>{question.difficulty}</Badge>
                            </div>

                            <div className="prose dark:prose-invert max-w-none space-y-6">
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Problem Statement</h3>
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{question.problem}</p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Input Format</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                            {question.inputFormat}
                                        </p>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Output Format</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                            {question.outputFormat}
                                        </p>
                                    </section>
                                </div>

                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Constraints</h3>
                                    <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 ml-2">
                                        {question.constraints.map((c, i) => <li key={i} className="text-sm font-mono">{c}</li>)}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Example Case</h3>
                                    <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm space-y-3">
                                        <div>
                                            <span className="text-emerald-500">Input:</span>
                                            <p className="text-zinc-300 mt-1">{question.example.input}</p>
                                        </div>
                                        <div>
                                            <span className="text-amber-500">Output:</span>
                                            <p className="text-zinc-300 mt-1">{question.example.output}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <button
                                        onClick={() => setHintOpen(!hintOpen)}
                                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all px-1 py-1"
                                    >
                                        <span>{hintOpen ? 'Hide Hint' : 'Show Hint'}</span>
                                        <ChevronDown size={18} className={`transition-transform ${hintOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {hintOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-3"
                                            >
                                                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                                                    {question.hint}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </div>

                            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-4">
                                <button className="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    Save for Later
                                </button>
                                <button
                                    className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all transform active:scale-95"
                                    onClick={() => window.location.hash = '#practice'}
                                >
                                    Start Practice
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const PracticeArena = ({ onShowToast }) => {
    const [code, setCode] = useState("def solve(matrix):\n    # Write your solution here\n    result = []\n    return result\n\n# Example Test\nprint(solve([[1,2,3],[4,5,6],[7,8,9]]))");
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [output, setOutput] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'editor', 'console'

    const runCode = () => {
        setRunning(true);
        setOutput(null);
        setTimeout(() => {
            setOutput({
                content: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
                time: "14ms",
                memory: "12.4MB",
                status: "Accepted"
            });
            setRunning(false);
        }, 1200);
    };

    const submitCode = () => {
        setSubmitting(true);
        setTimeout(() => {
            setSubmitted(true);
            setSubmitting(false);
            onShowToast("Submission Successful! Score: 100/100", "success");
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-4 overflow-hidden"
        >
            {/* Mobile Tabs */}
            <div className="flex lg:hidden bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-2">
                {['problem', 'editor', 'console'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab
                            ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-zinc-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Question Panel */}
            <Card className={`w-full lg:w-1/3 flex flex-col ${activeTab !== 'problem' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-indigo-500" />
                        Problem Details
                    </h2>
                    <Badge variant="warning">Medium</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    <section>
                        <h1 className="text-lg md:text-xl font-bold mb-3">Spiral Matrix Traversal</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Implement an algorithm that extracts elements from a square or rectangular matrix in a spiral pattern, beginning at the top-left and moving clockwise.
                        </p>
                    </section>

                    <div className="space-y-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Example Case</h4>
                            <code className="text-xs text-zinc-700 dark:text-zinc-300">
                                Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]<br />
                                Output: [1,2,3,6,9,8,7,4,5]
                            </code>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Complexity Target</h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Time: O(M * N) | Space: O(1)</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Editor & Console Container */}
            <div className={`flex-1 flex flex-col gap-4 ${activeTab === 'problem' ? 'hidden lg:flex' : 'flex'}`}>
                {/* Editor Section */}
                <Card className={`flex-1 flex flex-col min-h-[300px] md:min-h-[400px] ${activeTab === 'console' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                                <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" className="w-4 h-4" alt="Python" />
                                <span className="text-xs font-semibold">solution.py</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={runCode}
                                disabled={running || submitting}
                                className="flex items-center gap-2 px-3 md:px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg text-[10px] md:text-xs transition-colors"
                            >
                                <Play size={14} fill="currentColor" /> <span className="hidden md:inline">Run</span>
                            </button>
                            <button
                                onClick={submitCode}
                                disabled={running || submitting}
                                className="flex items-center gap-2 px-4 md:px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] md:text-xs transition-shadow shadow-md shadow-indigo-200 dark:shadow-none"
                            >
                                <Send size={14} /> <span className="hidden md:inline">Submit</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            defaultValue={code}
                            theme="vs-dark"
                            onChange={(v) => setCode(v)}
                            options={{
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                padding: { top: 16 },
                                wordWrap: 'on'
                            }}
                        />
                    </div>
                </Card>

                {/* Console Section */}
                <Card className={`h-40 md:h-48 flex flex-col transition-all overflow-hidden ${submitted ? 'h-64' : ''} ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 flex items-center justify-between">
                        <h3 className="text-xs font-bold flex items-center gap-2">
                            <Terminal size={14} className="text-zinc-400" />
                            Console & Output
                        </h3>
                        {output && <Badge variant="success">{output.status}</Badge>}
                    </div>
                    <div className="flex-1 p-4 bg-zinc-950 text-zinc-300 font-mono text-[10px] md:text-xs overflow-y-auto">
                        {running ? (
                            <div className="flex items-center gap-2 text-zinc-500">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                Running test cases...
                            </div>
                        ) : output ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-6 pb-2 border-b border-zinc-900">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-zinc-500" />
                                        <span>{output.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Cpu size={12} className="text-zinc-500" />
                                        <span>{output.memory}</span>
                                    </div>
                                </div>
                                <pre>{output.content}</pre>
                            </div>
                        ) : submitted ? (
                            <div className="p-2 space-y-4">
                                {submitted && <ConfettiEffect />}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={16} className="text-amber-500" />
                                        <span className="text-sm font-bold text-white">Score: 100/100</span>
                                    </div>
                                    <Badge variant="success">All Test Cases Passed</Badge>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                                    {[1, 2, 3, 4].map(tc => (
                                        <div key={tc} className="p-2 md:p-3 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                                            <span className="text-zinc-500 text-[8px] md:text-[10px] items-center uppercase font-bold tracking-widest">Case {tc}</span>
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                                <Card className="p-3 md:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1 text-xs md:text-sm">
                                        <Sparkles size={12} /> AI Feedback
                                    </div>
                                    <p className="text-[10px] md:text-xs italic text-zinc-400 leading-relaxed">
                                        Excellent implementation. Your approach handles rectangular matrices correctly by managing pointers efficiently.
                                    </p>
                                </Card>
                            </div>
                        ) : (
                            <span className="text-zinc-600 italic">Click 'Run' to see the output here.</span>
                        )}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

const Submissions = () => {
    const tableData = [
        { problem: 'Circular Queue', difficulty: 'Medium', status: 'Passed', score: '100/100', runtime: '12ms', date: '2023-11-20' },
        { problem: 'Merge Intervals', difficulty: 'Hard', status: 'Passed', score: '100/100', runtime: '45ms', date: '2023-11-18' },
        { problem: 'Valid Parentheses', difficulty: 'Easy', status: 'Passed', score: '100/100', runtime: '8ms', date: '2023-11-15' },
        { problem: 'DFS Traversal', difficulty: 'Medium', status: 'Failed', score: '45/100', runtime: 'N/A', date: '2023-11-12' },
        { problem: 'Two Sum', difficulty: 'Easy', status: 'Passed', score: '100/100', runtime: '10ms', date: '2023-11-10' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Submission History</h2>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <Search size={18} className="text-zinc-400" />
                    </button>
                </div>
            </div>

            <Card className="overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Question</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Runtime</th>
                            <th className="px-6 py-4 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {tableData.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">{row.problem}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={row.difficulty === 'Easy' ? 'success' : row.difficulty === 'Medium' ? 'warning' : 'error'}>
                                        {row.difficulty}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Passed' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <span className="text-sm">{row.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm">{row.score}</td>
                                <td className="px-6 py-4 text-zinc-500 text-sm italic">{row.runtime}</td>
                                <td className="px-6 py-4 text-right text-zinc-500 text-xs">{row.date}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </motion.div>
    );
};

const Analytics = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold">Performance Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-500" />
                        Accuracy vs. Difficulty
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_PERFORMANCE_DATA}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <PieChart size={18} className="text-violet-500" />
                        Top Skills Targeted
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Algorithms', value: 400 },
                                        { name: 'Data Structures', value: 300 },
                                        { name: 'OOP', value: 300 },
                                        { name: 'Recursion', value: 200 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Longest Streak', value: '18 Days', sub: 'Best: 22 Days', color: 'from-orange-500 to-rose-500' },
                    { label: 'Global Rank', value: '#1,245', sub: 'Top 0.5%', color: 'from-emerald-500 to-teal-500' },
                    { label: 'Avg Feedback', value: 'Positive', sub: '92% AI Approval', color: 'from-indigo-500 to-violet-500' },
                ].map((box, i) => (
                    <Card key={i} className={`p-6 bg-gradient-to-br ${box.color} border-none`}>
                        <h4 className="text-white/70 text-sm font-medium">{box.label}</h4>
                        <p className="text-2xl font-bold text-white mb-1">{box.value}</p>
                        <p className="text-white/60 text-xs">{box.sub}</p>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

// --- MAIN LAYOUT ---

export default function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['dashboard', 'generate', 'practice', 'submissions', 'analytics'].includes(hash)) {
                setActivePage(hash);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'generate', label: 'AI Generator', icon: Sparkles },
        { id: 'practice', label: 'Practice Arena', icon: Code2 },
        { id: 'submissions', label: 'Submissions', icon: History },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className={`${darkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
            <div className="flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: collapsed ? 80 : 260,
                        x: mobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
                    }}
                    className={`fixed h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl z-[70] flex flex-col shadow-xl shadow-indigo-500/5 transition-all duration-300 ${mobileMenuOpen ? 'left-0' : 'lg:left-0'}`}
                >
                    <div className="h-16 flex items-center px-6 gap-3 border-b border-zinc-100 dark:border-zinc-800 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Zap className="text-white" size={18} />
                        </div>
                        {(!collapsed || mobileMenuOpen) && <span className="font-bold text-lg tracking-tight whitespace-nowrap">PyLMS AI</span>}
                        {mobileMenuOpen && (
                            <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-2 lg:hidden">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => window.location.hash = item.id}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative group ${activePage === item.id
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                    }`}
                            >
                                <item.icon size={20} className={activePage === item.id ? 'scale-110 transition-transform' : ''} />
                                {(!collapsed || mobileMenuOpen) && <span className="font-semibold text-sm">{item.label}</span>}
                                {activePage === item.id && (
                                    <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
                                )}
                                {collapsed && !mobileMenuOpen && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-6 border-t border-zinc-100 dark:border-zinc-800 items-center gap-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        {collapsed ? <Menu size={20} /> : <div className="flex items-center gap-3"><X size={20} /><span className="text-sm font-medium">Collapse</span></div>}
                    </button>
                </motion.aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 min-w-0 ${collapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'}`}>
                    {/* Navbar */}
                    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 lg:hidden rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Menu size={20} />
                            </button>
                            <div className="relative max-w-md w-full hidden md:block">
                                <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search challenges, lessons, notes..."
                                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                />
                            </div>
                            <div className="lg:hidden flex items-center gap-2">
                                <Zap className="text-indigo-600" size={20} />
                                <span className="font-bold text-sm">PyLMS AI</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-5">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
                            </button>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative cursor-pointer group">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900" />
                            </div>
                            <div className="h-6 md:h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden xs:block" />
                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold">Alex Dev</p>
                                    <p className="text-[10px] text-zinc-500">Premium Scholar</p>
                                </div>
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-0.5">
                                    <div className="w-full h-full rounded-[10px] bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                        <User size={20} className="text-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className="p-4 md:p-8 max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activePage === 'dashboard' && <Dashboard />}
                                {activePage === 'generate' && <QuestionGenerator />}
                                {activePage === 'practice' && <PracticeArena onShowToast={showToast} />}
                                {activePage === 'submissions' && <Submissions />}
                                {activePage === 'analytics' && <Analytics />}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </main>

                <AnimatePresence>
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
