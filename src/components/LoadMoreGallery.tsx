"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, FolderOpen, MoreHorizontal } from "lucide-react";
import { fetchMoreMediaAction } from "@/app/mediaActions";

import { deleteMediaAction } from "@/app/actions";
import { assignMediaToAlbumAction } from "@/app/albumActions";

export default function LoadMoreGallery({ 
  initialMedia, 
  initialHasMore, 
  initialCursor, 
  timelineItemId, 
  albumId, 
  isPublicView,
  albums = [] 
}: { 
  initialMedia: any[], 
  initialHasMore: boolean, 
  initialCursor: string | null, 
  timelineItemId: string, 
  albumId?: string, 
  isPublicView: boolean,
  albums?: any[]
}) {
  const [media, setMedia] = useState(initialMedia);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const loadMore = async () => {
    if (!cursor) return;
    try {
      const res = await fetchMoreMediaAction(timelineItemId, cursor, albumId, isPublicView);
      setMedia(prev => [...prev, ...res.media]);
      setHasMore(res.hasMore);
      setCursor(res.nextCursor);
    } catch (error) {
      console.error(error);
      alert("Errore nel caricamento delle foto.");
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    // Optimistic UI update
    setMedia(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleChangeAlbum = (mediaId: string, newAlbumId: string | null) => {
    // If we are currently filtered by an album, moving the media out of it should remove it from the view
    if (albumId && newAlbumId !== albumId) {
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    }
  };

  return (
    <div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {media.map((item: any) => (
          <div key={item.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm relative group bg-stone-100" onMouseLeave={() => setOpenMenuId(null)}>
            {item.type === "VIDEO" ? (
              <video src={`/api/media/${item.id}`} className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]" controls muted playsInline />
            ) : (
              <Image 
                src={`/api/media/${item.id}`} 
                alt="Ricordo" 
                width={800} 
                height={800} 
                className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Context Menu for Private View Only */}
            {!isPublicView && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white text-stone-700"
                  onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {openMenuId === item.id && (
                  <div className="absolute top-10 right-0 w-48 bg-white border border-stone-200 shadow-xl rounded-lg p-1 z-10 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1.5 text-xs font-semibold text-stone-500">Sposta in...</div>
                    
                    <button 
                      onClick={() => { 
                        setOpenMenuId(null); 
                        handleChangeAlbum(item.id, null);
                        startTransition(() => assignMediaToAlbumAction(item.id, null)); 
                      }}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-stone-100 ${item.albumId === null ? 'font-bold bg-stone-50' : ''}`}
                    >
                      <FolderOpen className="h-4 w-4" /> Tutte le foto
                    </button>
                    
                    {albums.map(a => (
                      <button 
                        key={a.id}
                        onClick={() => { 
                          setOpenMenuId(null); 
                          handleChangeAlbum(item.id, a.id);
                          startTransition(() => assignMediaToAlbumAction(item.id, a.id)); 
                        }}
                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-stone-100 ${item.albumId === a.id ? 'font-bold bg-stone-50' : ''}`}
                      >
                        <FolderOpen className="h-4 w-4" /> {a.name}
                      </button>
                    ))}
                    
                    <div className="h-px bg-stone-200 my-1 mx-2" />
                    
                    <button 
                      onClick={() => { 
                        setOpenMenuId(null); 
                        handleRemoveMedia(item.id);
                        startTransition(() => deleteMediaAction(item.id)); 
                      }}
                      className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Elimina foto
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12 mb-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => startTransition(() => loadMore())}
            disabled={isPending}
            className="rounded-full shadow-sm hover:bg-stone-50 text-stone-700 font-serif"
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Carica altre foto
          </Button>
        </div>
      )}
    </div>
  );
}
