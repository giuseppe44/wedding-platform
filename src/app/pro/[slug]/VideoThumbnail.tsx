import { Play } from "lucide-react";

export default async function VideoThumbnail({ url }: { url: string }) {
  let thumbUrl = null;
  const href = url.startsWith('http') ? url : `https://${url}`;

  // YouTube
  const ytMatch = href.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    thumbUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // Vimeo
  const vimeoMatch = href.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    try {
      const res = await fetch(`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`, { next: { revalidate: 86400 } });
      if (res.ok) {
        const data = await res.json();
        thumbUrl = data[0]?.thumbnail_large;
      }
    } catch (e) {
      // ignore, fallback will be used
    }
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-stone-100 shadow-sm relative group border border-stone-200">
      {thumbUrl ? (
        <img src={thumbUrl} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
          <span className="text-stone-500 font-serif text-lg italic">Video</span>
        </div>
      )}
      <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play className="w-8 h-8 text-rose-500 ml-1 fill-rose-500" />
        </div>
      </a>
    </div>
  );
}
