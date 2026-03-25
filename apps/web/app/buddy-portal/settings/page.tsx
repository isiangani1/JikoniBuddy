import Link from "next/link";

const notificationOptions = [
  {
    title: "New job requests",
    note: "Instant alerts when a seller requests help.",
    enabled: true
  },
  {
    title: "Job reminders",
    note: "Remind you 30 minutes before your shift.",
    enabled: true
  },
  {
    title: "Payment updates",
    note: "Notify when payouts are confirmed.",
    enabled: false
  }
];

const deliveryChannels = [
  {
    title: "Push notifications (FCM)",
    note: "Fastest delivery for in-app alerts.",
    status: "Connected"
  },
  {
    title: "SMS fallback",
    note: "Send SMS when the app is offline.",
    status: "Enable"
  }
];

export default function BuddyPortalSettingsPage() {
  return (
    <>
      <main className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
        <section className="flex flex-col gap-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white m-0">Notification preferences</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Preference</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Notes</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50 w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {notificationOptions.map((option) => (
                  <tr key={option.title} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white" data-label="Preference">{option.title}</td>
                    <td className="p-4 text-white/70" data-label="Notes">{option.note}</td>
                    <td className="p-4" data-label="Status">
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#12021f] ${option.enabled ? "bg-purple-600" : "bg-white/20"}`}
                        type="button"
                        aria-pressed={option.enabled}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${option.enabled ? "translate-x-6" : "translate-x-1"}`} />
                        <span className="sr-only">
                          {option.enabled ? "On" : "Off"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <h2 className="text-2xl font-bold text-white m-0">Delivery channels</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Channel</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Notes</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deliveryChannels.map((channel) => (
                  <tr key={channel.title} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white" data-label="Channel">{channel.title}</td>
                    <td className="p-4 text-white/70" data-label="Notes">{channel.note}</td>
                    <td className="p-4" data-label="Status">
                      <button className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white" type="button">
                        {channel.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
