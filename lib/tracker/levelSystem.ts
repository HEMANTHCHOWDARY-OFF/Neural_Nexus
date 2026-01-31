export const LEVEL_THRESHOLDS = {
    SEED: 0,
    SPROUT: 50,
    SMALL_TREE: 100,
    BIG_TREE: 150,
    BLOOMING_TREE: 200
};

export interface LevelInfo {
    name: string;
    nextLevelXp: number | null;
    progress: number;
    iconType: "seed" | "sprout" | "shrub" | "trees" | "flower";
    level: number;
}

export const getLevelInfo = (xp: number): LevelInfo => {
    if (xp >= LEVEL_THRESHOLDS.BLOOMING_TREE) {
        return {
            name: "Eternal Tree",
            nextLevelXp: null, // Max level
            progress: 100,
            iconType: "flower",
            level: 5
        };
    } else if (xp >= LEVEL_THRESHOLDS.BIG_TREE) {
        return {
            name: "Big Tree",
            nextLevelXp: LEVEL_THRESHOLDS.BLOOMING_TREE,
            progress: calculateProgress(xp, LEVEL_THRESHOLDS.BIG_TREE, LEVEL_THRESHOLDS.BLOOMING_TREE),
            iconType: "trees",
            level: 4
        };
    } else if (xp >= LEVEL_THRESHOLDS.SMALL_TREE) {
        return {
            name: "Small Tree",
            nextLevelXp: LEVEL_THRESHOLDS.BIG_TREE,
            progress: calculateProgress(xp, LEVEL_THRESHOLDS.SMALL_TREE, LEVEL_THRESHOLDS.BIG_TREE),
            iconType: "shrub",
            level: 3
        };
    } else if (xp >= LEVEL_THRESHOLDS.SPROUT) {
        return {
            name: "Sprout",
            nextLevelXp: LEVEL_THRESHOLDS.SMALL_TREE,
            progress: calculateProgress(xp, LEVEL_THRESHOLDS.SPROUT, LEVEL_THRESHOLDS.SMALL_TREE),
            iconType: "sprout",
            level: 2
        };
    } else {
        return {
            name: "Seed",
            nextLevelXp: LEVEL_THRESHOLDS.SPROUT,
            progress: calculateProgress(xp, 0, LEVEL_THRESHOLDS.SPROUT),
            iconType: "seed",
            level: 1
        };
    }
};

const calculateProgress = (currentXp: number, levelMin: number, levelMax: number) => {
    const range = levelMax - levelMin;
    const gained = currentXp - levelMin;
    return Math.min(100, Math.max(0, (gained / range) * 100));
};
