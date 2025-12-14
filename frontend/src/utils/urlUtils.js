
export const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate movie URL
 * Example: /movie/27205/inception
 */
export const getMovieUrl = (id, title) => {
  const slug = createSlug(title);
  return `/movie/${id}/${slug}`;
};

/**
 * Generate person URL
 * Example: /person/525/christopher-nolan
 */
export const getPersonUrl = (id, name) => {
  const slug = createSlug(name);
  return `/person/${id}/${slug}`;
};

/**
 * Extract ID from URL path
 * Example: "/movie/27205/inception" -> "27205"
 */
export const extractIdFromPath = (path) => {
  const parts = path.split('/');
  return parts[2]; // ID is always the second segment after the type
};