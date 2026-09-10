import { requireAuth } from "@/lib/auth";
import { getNotifications, markNotificationAsRead } from "@/app/notificationActions";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const notifications = await getNotifications();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-stone-800 mb-8 flex items-center gap-3">
        <Bell className="w-8 h-8" /> Notifiche
      </h1>
      
      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500">
          Non hai nessuna notifica.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`bg-white p-6 rounded-xl border ${notif.isRead ? 'border-stone-200 opacity-60' : 'border-orange-300 shadow-sm'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-stone-800">{notif.title}</h3>
                  {notif.message && <p className="text-stone-600 mt-1">{notif.message}</p>}
                </div>
                <div className="text-xs text-stone-400 text-right">
                  {notif.createdAt.toLocaleDateString("it-IT")}<br/>
                  {!notif.isRead && (
                    <form action={markNotificationAsRead.bind(null, notif.id)}>
                      <button type="submit" className="text-orange-600 hover:underline mt-2">Segna come letta</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
