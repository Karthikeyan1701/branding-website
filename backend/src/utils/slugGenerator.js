export const generateSlug = (slugText) => {
  return slugText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/^[a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};
