export type Video = {
  id: string;
  title: string;
  channel: string;
  views: number;
  createdAt: string; // ISO timestamp
  duration: string;  // e.g. "12:34"
  thumbnailUrl: string;
  videoUrl: string;  // local /videos/*.mp4 or external URL
};
