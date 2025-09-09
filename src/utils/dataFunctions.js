export class Statistics {
    static mean(arr) {
        if (!arr.length) return null;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    static median(arr) {
        if (!arr.length) return null;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    static stdDeviation(arr) {
        if (!arr.length) return null;
        const mean = Statistics.mean(arr);
        const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }

    static last(arr) {
        if (!arr.length) return null;
        return arr[arr.length - 1];
    }

    static min(arr) {
        if (!arr.length) return null;
        return Math.min(...arr);
    }

    static max(arr) {
        if (!arr.length) return null;
        return Math.max(...arr);
    }
    static round(value, decimals = 1) {
        if (typeof value !== 'number' || typeof decimals !== 'number') return null;
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
}