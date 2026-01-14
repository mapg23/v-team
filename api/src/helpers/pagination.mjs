/**
 * A module that contains pagination related functions.
 */


export function calculatePagination({ page = 1, limit = 50 } = {}) {
    const p = Number(page) || 1;
    const l = Number(limit) || 50;
    // Antalet rader innan den sidan
    const offset = (p - 1) * l;

    return { page: p, limit: l, offset };
}
