"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FolderPlus, Trash2 } from "lucide-react";
import { createAlbumAction, deleteAlbumAction } from "@/app/albumActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoadMoreGallery from "@/components/LoadMoreGallery";

export default function ChapterGallery({ 
  approvedMedia, 
  albums, 
  chapterId, 
  initialHasMore, 
  initialCursor, 
  currentAlbumId 
}: { 
  approvedMedia: any[], 
  albums: any[], 
  chapterId: string,
  initialHasMore: boolean,
  initialCursor: string | null,
  currentAlbumId: string | null
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleAlbumChange = (albumId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (albumId) {
      params.set('albumId', albumId);
    } else {
      params.delete('albumId');
    }
    startTransition(() => {
      router.push(pathname + '?' + params.toString());
    });
  };

  const currentAlbum = currentAlbumId ? albums.find(a => a.id === currentAlbumId) : null;

  return (
    <div className="w-full">
      {/* Pills Navigation */}
      <div className="flex flex-nowrap md:flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant={currentAlbumId === null ? "default" : "outline"} 
          className={`rounded-full shrink-0 ${currentAlbumId === null ? 'bg-stone-800 text-white' : 'text-stone-600 border-stone-300'}`}
          onClick={() => handleAlbumChange(null)}
          disabled={isPending}
        >
          Tutte
        </Button>
        
        {albums.map(a => (
          <Button 
            key={a.id}
            variant={currentAlbumId === a.id ? "default" : "outline"} 
            className={`rounded-full shrink-0 ${currentAlbumId === a.id ? 'bg-stone-800 text-white' : 'text-stone-600 border-stone-300'}`}
            onClick={() => handleAlbumChange(a.id)}
            disabled={isPending}
          >
            {a.name}
          </Button>
        ))}

        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-full shrink-0 text-stone-500 hover:text-stone-800 hover:bg-stone-200 border border-dashed border-stone-300 gap-2">
            <FolderPlus className="w-4 h-4" /> Nuova Raccolta
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Nuova Raccolta</DialogTitle>
            </DialogHeader>
            <form action={createAlbumAction.bind(null, chapterId)} className="space-y-4 pt-4">
              <div className="space-y-2 pb-4">
                <Label>Nome della raccolta</Label>
                <Input name="name" required placeholder="es. Rinfresco" className="focus:ring-stone-800" />
              </div>
              <DialogFooter>
                <DialogClose type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Annulla</DialogClose>
                <Button type="submit" className="bg-stone-800 hover:bg-stone-700">Crea</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Album Tools */}
      {currentAlbum && (
        <div className="flex justify-between items-center mb-6 bg-stone-100 px-4 py-2 rounded-lg">
          <span className="font-serif text-stone-600">Fotografie in "{currentAlbum.name}"</span>
          <form action={deleteAlbumAction.bind(null, currentAlbum.id)}>
            <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2 h-8 px-2">
              <Trash2 className="w-4 h-4" /> Elimina Raccolta
            </Button>
          </form>
        </div>
      )}

      {/* Load More Gallery */}
      {approvedMedia.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 shadow-sm mb-8">
          <Camera className="w-12 h-12 mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500 font-serif text-lg">Nessuna fotografia in questa raccolta.</p>
        </div>
      ) : (
        <div className={isPending ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity'}>
          <LoadMoreGallery 
            initialMedia={approvedMedia}
            initialHasMore={initialHasMore}
            initialCursor={initialCursor}
            timelineItemId={chapterId}
            albumId={currentAlbumId || undefined}
            isPublicView={false}
            albums={albums}
          />
        </div>
      )}
    </div>
  );
}
