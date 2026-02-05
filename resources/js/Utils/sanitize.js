/**
 * Safely decode HTML entities from pagination labels
 * Laravel's pagination uses &laquo; and &raquo; for Previous/Next
 * This function safely converts them to readable text
 */
export function decodePaginationLabel(label) {
    if (!label) return '';

    // Create a temporary element to decode HTML entities safely
    const textarea = document.createElement('textarea');
    textarea.innerHTML = label;
    return textarea.value;
}

/**
 * Get a safe text representation of pagination label
 * Converts HTML entities to Unicode characters
 */
export function getSafePaginationLabel(label) {
    if (!label) return '';

    // Common pagination patterns
    const replacements = {
        '&laquo;': '«',
        '&raquo;': '»',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&#039;': "'",
    };

    let result = label;
    for (const [entity, char] of Object.entries(replacements)) {
        result = result.replace(new RegExp(entity, 'g'), char);
    }

    return result;
}
