import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

// Configuration
const DB_FILE_KEY = 'antigravity_cp_db'; // Key for localStorage persistence of the binary DB

let dbInstance: Database | null = null;
let SQL: SqlJsStatic | null = null;

/**
 * Initialize the SQLite Database.
 * Loads from localStorage if available, otherwise creates a new DB.
 */
export const initDB = async (): Promise<Database> => {
    if (dbInstance) return dbInstance;

    try {
        // 1. Load SQL.js
        if (!SQL) {
            SQL = await initSqlJs({
                locateFile: () => `/sql-wasm.wasm`
            });
        }

        // 2. Try to load existing binary from localStorage
        const savedDb = localStorage.getItem(DB_FILE_KEY);

        if (savedDb) {
            const binary = toBinArray(savedDb);
            dbInstance = new SQL.Database(binary);
        } else {
            dbInstance = new SQL.Database();
            // Initialize Schema
            initSchema(dbInstance);
            saveDB();
        }

        return dbInstance;
    } catch (err) {
        console.error("Failed to initialize SQLite:", err);
        throw err;
    }
};

/**
 * Creates the necessary tables if they don't exist.
 */
const initSchema = (db: Database) => {
    const schema = `
    CREATE TABLE IF NOT EXISTS user_cp_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      completed_date TEXT NOT NULL,
      xp_awarded INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_user_problem ON user_cp_progress(user_id, problem_id);
  `;
    db.run(schema);
};

/**
 * Save the DB binary to localStorage (Simulating file persistence).
 */
const saveDB = () => {
    if (!dbInstance) return;
    const binary = dbInstance.export();
    const binaryString = toBinString(binary);
    localStorage.setItem(DB_FILE_KEY, binaryString);
};

// --- Helper Functions for Binary String ---
const toBinString = (arr: Uint8Array) => {
    let uarr = new Uint8Array(arr);
    let strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (let i = 0; i * chunksize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, Array.from(uarr.subarray(i * chunksize, (i + 1) * chunksize))));
    }
    return strings.join('');
};

const toBinArray = (str: string) => {
    let l = str.length, arr = new Uint8Array(l);
    for (let i = 0; i < l; i++) arr[i] = str.charCodeAt(i);
    return arr;
};

// --- Public API ---

// Define types for database records
export interface ProblemProgress {
    id: string;
    user_id: string;
    problem_id: string; // Changed from 'problem_id' in schema which is snake_case to match query results 
    completed_date: string;
    xp_awarded: number;
}

export const getProblemProgress = (userId: string): ProblemProgress[] => {
    if (!dbInstance) return [];
    // Returns array of objects
    const stmt = dbInstance.prepare("SELECT * FROM user_cp_progress WHERE user_id = :uid");
    const result: ProblemProgress[] = [];
    stmt.bind({ ':uid': userId });
    while (stmt.step()) {
        // cast to unknown first because getAsObject returns ParamsObject which is a dictionary type
        result.push(stmt.getAsObject() as unknown as ProblemProgress);
    }
    stmt.free();
    return result;
};

export const markProblemComplete = (userId: string, problemId: string, xp = 0) => {
    if (!dbInstance) throw new Error("DB not initialized");

    // Check if already exists (Idempotency)
    const check = dbInstance.exec(`SELECT 1 FROM user_cp_progress WHERE user_id = '${userId}' AND problem_id = '${problemId}'`);
    if (check.length > 0 && check[0].values.length > 0) {
        return false; // Already completed
    }

    const id = crypto.randomUUID();
    const date = new Date().toISOString();

    dbInstance.run(
        "INSERT INTO user_cp_progress VALUES (?, ?, ?, ?, ?)",
        [id, userId, problemId, date, xp]
    );

    saveDB(); // Persist immediately
    return true;
};
