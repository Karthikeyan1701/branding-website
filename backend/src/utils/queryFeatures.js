export const buildQueryFeatures = (queryData) => {
    const page = parseInt(queryData.page, 10) || 1;
    const limit = parseInt(queryData.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortBy = queryData.sortBy || "createdAt";
    const order = queryData.order === "asc" ? 1 : -1;

    return { page, limit, skip, sortBy, order };
};