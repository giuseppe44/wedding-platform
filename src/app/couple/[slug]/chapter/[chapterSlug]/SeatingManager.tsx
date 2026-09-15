"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createTable, deleteTable, createGuest, deleteGuest, assignGuestToTable, updateGuest } from "@/app/seatingActions";
import { Trash2, Users, Printer, LayoutGrid, List } from "lucide-react";
import SeatingVisualizer from "./SeatingVisualizer";

export default function SeatingManager({ chapter, guests, tables }: { chapter: any, guests: any[], tables: any[] }) {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"LIST" | "MAP">("LIST");
  
  const [newTableName, setNewTableName] = useState("");
  const [newTableCap, setNewTableCap] = useState("10");
  const [newTableShape, setNewTableShape] = useState("ROUND");

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestSurname, setNewGuestSurname] = useState("");
  const [newGuestDiet, setNewGuestDiet] = useState("");

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName) return;
    setLoading(true);
    await createTable(chapter.id, { name: newTableName, capacity: newTableCap, type: newTableShape }, chapter.slug);
    setNewTableName("");
    setLoading(false);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestSurname) return;
    setLoading(true);
    await createGuest(chapter.id, { name: newGuestName, surname: newGuestSurname, dietaryNotes: newGuestDiet }, chapter.slug);
    setNewGuestName("");
    setNewGuestSurname("");
    setNewGuestDiet("");
    setLoading(false);
  };

  const printSummary = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    
    let html = '<html><head><title>Riepilogo Tavoli</title><style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;margin-bottom:20px;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} .diet{color:red;font-size:0.9em;}</style></head><body>';
    html += `<h1>Riepilogo Tavoli - ${chapter.title || 'Matrimonio'}</h1>`;
    
    tables.forEach(table => {
      const tableGuests = guests.filter(g => g.tableId === table.id);
      html += `<h2>${table.name} (${tableGuests.length} / ${table.capacity})</h2>`;
      html += '<table><tr><th>Nome</th><th>Cognome</th><th>Esigenze Alimentari</th></tr>';
      tableGuests.forEach(g => {
        html += `<tr><td>${g.name}</td><td>${g.surname}</td><td class="diet">${g.dietaryNotes || ''}</td></tr>`;
      });
      html += '</table>';
    });

    const unassigned = guests.filter(g => !g.tableId);
    if (unassigned.length > 0) {
      html += `<h2>Non Assegnati (${unassigned.length})</h2>`;
      html += '<table><tr><th>Nome</th><th>Cognome</th><th>Esigenze Alimentari</th></tr>';
      unassigned.forEach(g => {
        html += `<tr><td>${g.name}</td><td>${g.surname}</td><td class="diet">${g.dietaryNotes || ''}</td></tr>`;
      });
      html += '</table>';
    }

    html += '</body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-serif text-stone-800">Gestione Ospiti e Tavoli</h2>
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 p-1 rounded-md flex border border-stone-200">
            <Button variant={viewMode === "LIST" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("LIST")} className={viewMode === "LIST" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"}>
              <List className="w-4 h-4 mr-2" /> Liste
            </Button>
            <Button variant={viewMode === "MAP" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("MAP")} className={viewMode === "MAP" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"}>
              <LayoutGrid className="w-4 h-4 mr-2" /> Piantina
            </Button>
          </div>
          <Button onClick={printSummary} variant="outline" className="gap-2"><Printer className="w-4 h-4"/> Stampa Liste</Button>
        </div>
      </div>

      {viewMode === "MAP" ? (
        <SeatingVisualizer tables={tables} guests={guests} title={chapter.title || 'Matrimonio'} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Aggiungi Ospite */}
        <Card>
          <CardHeader>
            <CardTitle>Aggiungi Ospite</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Cognome</Label>
                  <Input value={newGuestSurname} onChange={(e) => setNewGuestSurname(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Intolleranze / Esigenze Alimentari</Label>
                <Input value={newGuestDiet} onChange={(e) => setNewGuestDiet(e.target.value)} placeholder="es. Celiaco, Vegetariano..." className="text-red-600 placeholder:text-stone-400" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">Aggiungi Ospite</Button>
            </form>
          </CardContent>
        </Card>

        {/* Aggiungi Tavolo */}
        <Card>
          <CardHeader>
            <CardTitle>Aggiungi Tavolo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Tavolo</Label>
                  <Input value={newTableName} onChange={(e) => setNewTableName(e.target.value)} placeholder="es. Tavolo Sposi, Tavolo 1" required />
                </div>
                <div className="space-y-2">
                  <Label>Numero Posti</Label>
                  <Input type="number" value={newTableCap} onChange={(e) => setNewTableCap(e.target.value)} required min="1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Forma del Tavolo</Label>
                <select 
                  value={newTableShape} 
                  onChange={(e) => setNewTableShape(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
                >
                  <option value="ROUND">Rotondo</option>
                  <option value="RECTANGULAR">Rettangolare (Imperiale)</option>
                  <option value="SQUARE">Quadrato</option>
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">Aggiungi Tavolo</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map(table => {
          const tableGuests = guests.filter(g => g.tableId === table.id);
          const isFull = tableGuests.length >= table.capacity;

          return (
            <Card key={table.id} className="border-stone-200 shadow-sm relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <form action={deleteTable.bind(null, table.id, chapter.slug)}>
                    <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6"><Trash2 className="w-4 h-4"/></Button>
                  </form>
                </div>
                <CardDescription>{tableGuests.length} / {table.capacity} posti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tableGuests.map(g => (
                  <div key={g.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-md text-sm border border-stone-100">
                    <div>
                      <p className="font-medium">{g.name} {g.surname}</p>
                      {g.dietaryNotes && <p className="text-xs text-red-600">{g.dietaryNotes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-xs border p-1 rounded-md text-stone-500 max-w-[80px]"
                        onChange={async (e) => {
                          if (!e.target.value) return;
                          setLoading(true);
                          await assignGuestToTable(g.id, e.target.value, chapter.slug);
                          setLoading(false);
                        }}
                        value={table.id}
                        disabled={loading}
                      >
                        {tables.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <form action={assignGuestToTable.bind(null, g.id, null, chapter.slug)}>
                        <SubmitButton 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 hover:bg-red-50"
                          defaultText={<Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500"/>}
                          loadingText={<Trash2 className="w-4 h-4 text-stone-200 animate-pulse"/>}
                        />
                      </form>
                    </div>
                  </div>
                ))}
                
                {/* Assegna nuovo ospite se c'è posto */}
                {!isFull && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <select 
                      className="w-full text-sm border p-2 rounded-md"
                      onChange={async (e) => {
                        if (!e.target.value) return;
                        setLoading(true);
                        await assignGuestToTable(e.target.value, table.id, chapter.slug);
                        setLoading(false);
                      }}
                      value=""
                    >
                      <option value="">+ Assegna Ospite...</option>
                      {guests.filter(g => !g.tableId).map(g => (
                        <option key={g.id} value={g.id}>{g.name} {g.surname}</option>
                      ))}
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ospiti Non Assegnati ({guests.filter(g => !g.tableId).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guests.filter(g => !g.tableId).map(g => (
              <div key={g.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-stone-200">
                <div>
                  <p className="font-medium">{g.name} {g.surname}</p>
                  {g.dietaryNotes && <p className="text-xs text-red-600">{g.dietaryNotes}</p>}
                </div>
                  <form action={deleteGuest.bind(null, g.id, chapter.slug)}>
                    <SubmitButton 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50 h-8 w-8"
                      defaultText={<Trash2 className="w-4 h-4" />}
                      loadingText={<Trash2 className="w-4 h-4 text-stone-200 animate-pulse" />}
                    />
                  </form>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
