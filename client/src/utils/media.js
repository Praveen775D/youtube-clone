export const getMediaUrl = (url) => {
  if (!url) return "/default-thumbnail.png";
  if (url.startsWith("http")) return url;
  return `http://localhost:5000${url}`;
};