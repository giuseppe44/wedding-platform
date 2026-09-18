
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, FolderOpen, MoreHorizontal, Send, Plane } from "lucide-react";
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
    setMedia(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleChangeAlbum = (mediaId: string, newAlbumId: string | null) => {
    if (albumId && newAlbumId !== albumId) {
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    }
  };

  const handleSendPostcard = (m: any) => {
    const waText = encodeURIComponent(`Ciao ${m.uploaderName || "Caro Amico"}! Guardaci mentre ci godiamo il regalo che ci hai fatto! 📸✈️ Un abbraccio, gli Sposi.\n\nGuarda la foto: ${window.location.origin}/api/media/${m.id}`);
    window.open("https://wa.me/?text=" + waText, "_blank");
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

            {/* Travel Postcard overlay */}
            {!isPublicView && item.giftOptionId && item.uploaderName && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end pointer-events-none">
                <div className="bg-amber-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-auto shadow-sm">
                  <span className="font-semibold block truncate">Da: {item.uploaderName}</span>
                </div>
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg pointer-events-auto flex items-center gap-1 rounded-full px-3 h-8"
                  onClick={() => handleSendPostcard(item)}
                >
                  <Send className="w-3 h-3" /> Cartolina
                </Button>
              </div>
            )}
            
            {/* Context Menu for Private View Only */}
            {!isPublicView && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8 rounded-full bg-white/90 shadow-sm hover:bg-white text-stone-700 backdrop-blur-sm"
                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>

                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50">
                      <div className="p-1">
                        {albums.length > 0 && (
                          <div className="mb-1 pb-1 border-b border-stone-100">
                            <div className="px-2 py-1.5 text-xs font-semibold text-stone-500 flex items-center gap-2">
                              <FolderOpen className="w-3 h-3" /> Sposta in Album
                            </div>
                            {albums.map((a: any) => (
                              <button
                                key={a.id}
                                onClick={async () => {
                                  await assignMediaToAlbumAction(item.id, a.id);
                                  handleChangeAlbum(item.id, a.id);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-stone-100 transition-colors ${item.albumId === a.id ? "bg-stone-50 text-stone-900 font-medium" : "text-stone-600"}`}
                              >
                                {a.name}
                              </button>
                            ))}
                            {item.albumId && (
                              <button
                                onClick={async () => {
                                  await assignMediaToAlbumAction(item.id, null);
                                  handleChangeAlbum(item.id, null);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-stone-100 transition-colors text-stone-600 italic"
                              >
                                Rimuovi dall"album
                              </button>
                            )}
                          </div>
                        )}
                        <button
                          onClick={async () => {
                            if (confirm("Sei sicuro di voler eliminare questa foto?")) {
                              await deleteMediaAction(item.id);
                              handleRemoveMedia(item.id);
                            }
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Elimina
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => startTransition(() => loadMore())} 
            disabled={isPending}
            variant="outline"
            className="rounded-full px-8 bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-sm"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Caricamento...</>
            ) : (
              "Carica Altre Foto"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

