const LIMIT = 3;
const WINDOW_MS = 6 * 60 * 60 * 1000; // 6 ساعات
const STORAGE_KEY = "dicom_rate_limit";

export function getRateLimitStatus() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return { allowed: true, remaining: LIMIT, resetIn: null };
    }

    const { count, firstUpload } = JSON.parse(stored);
    const now = Date.now();
    const elapsed = now - firstUpload;

    // لو فات 6 ساعات → reset
    if (elapsed > WINDOW_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return { allowed: true, remaining: LIMIT, resetIn: null };
    }

    const remaining = LIMIT - count;
    const resetIn = Math.ceil((WINDOW_MS - elapsed) / 1000 / 60); // بالدقايق

    return {
        allowed: remaining > 0,
        remaining,
        resetIn, // كام دقيقة لحد ما يتفتح تاني
    };
}

export function recordUpload() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!stored) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ count: 1, firstUpload: now })
        );
        return;
    }

    const { count, firstUpload } = JSON.parse(stored);
    const elapsed = now - firstUpload;

    if (elapsed > WINDOW_MS) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ count: 1, firstUpload: now })
        );
    } else {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ count: count + 1, firstUpload })
        );
    }
}