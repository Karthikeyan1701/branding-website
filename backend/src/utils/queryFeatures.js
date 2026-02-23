export const buildQueryFeatures = (queryData) => {
    const page = Math.max(parseInt(queryData.page, 10) || 1, 1);

    const MAX_LIMIT = 50;
    const limit = Math.min(parseInt(queryData.limit, 10) || 10, MAX_LIMIT);
    
    const skip = (page - 1) * limit;

    const sortBy = queryData.sortBy || "createdAt";
    const order = queryData.order === "asc" ? 1 : -1;

    return { page, limit, skip, sortBy, order };
};