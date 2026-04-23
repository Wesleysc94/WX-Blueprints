import "server-only";

export const getTemplateVideoUrl = (slug: string): string | null => {
  const override = process.env[`NEXT_PUBLIC_VIDEO_${slug.toUpperCase().replace(/-/g, "_")}`];
  if (override) return override;

  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucket) return null;

  const path = encodeURIComponent(`blueprints/${slug}/preview.mp4`);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;
};
