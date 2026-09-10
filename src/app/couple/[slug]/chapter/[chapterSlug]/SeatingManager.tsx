"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createTable, deleteTable, createGuest, deleteGuest, assignGuestToTable, updateGuest } from "@/app/seatingActions";
import { Trash2, Users, Printer } from "lucide-react";

export default function SeatingManager({ chapter, guests, tables }: { chapter: any, guests: any[], tables: any[] }) {
  const [loading, setLoading] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCap, setNewTableCap] = useState("10");

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestSurname, setNewGuestSurname] = useState("");
  const [newGuestDiet, setNewGuestDiet] = useState("");

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName) return;
    setLoading(true);
    await createTable(chapter.id, { name: newTableName, capacity: newTableCap, type: "ROUND" }, chapter.slug);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-stone-800">Gestione Ospiti e Tavoli</h2>
        <Button onClick={printSummary} variant="outline" className="gap-2"><Printer className="w-4 h-4"/> Stampa Riepilogo Ristorante</Button>
      </div>

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
                    <form action={assignGuestToTable.bind(null, g.id, null, chapter.slug)}>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="w-4 h-4 text-stone-400"/></Button>
                    </form>
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
                  <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8"><Trash2 className="w-4 h-4"/></Button>
                </form>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
