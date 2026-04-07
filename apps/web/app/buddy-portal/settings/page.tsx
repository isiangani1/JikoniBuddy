import { useEffect, useState } from "react";
import { getBuddyId, getGatewayBaseUrl } from "@/lib/buddy-client";

const defaultPreferences = {
  jobRequests: true,
  jobReminders: true,
  paymentUpdates: false,
  channelPush: true,
  channelSms: false,
  channelEmail: false
};

export default function BuddyPortalSettingsPage() {
  const [prefs, setPrefs] = useState(defaultPreferences);
  const [availability, setAvailability] = useState<
    { dayOfWeek: number; startTime: string; endTime: string }[]
  >([]);
  const [autoAccept, setAutoAccept] = useState({
    autoAcceptEnabled: false,
    autoAcceptMaxKm: 5,
    autoAcceptMaxResponseMinutes: 30,
    autoAcceptMinRating: 4.5
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jb_notification_prefs");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setPrefs((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    const baseUrl = getGatewayBaseUrl();
    Promise.all([
      fetch(`${baseUrl}/api/buddy/users/${buddyId}/availability`).then((res) =>
        res.ok ? res.json() : []
      ),
      fetch(`${baseUrl}/api/buddy/users/${buddyId}/auto-accept`).then((res) =>
        res.ok ? res.json() : null
      )
    ])
      .then(([slots, rules]) => {
        if (Array.isArray(slots)) setAvailability(slots);
        if (rules) {
          setAutoAccept((prev) => ({ ...prev, ...rules }));
        }
      })
      .catch(() => null);
  }, []);

  const updatePref = (key: keyof typeof defaultPreferences) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("jb_notification_prefs", JSON.stringify(next));
      return next;
    });
  };

  const updateAvailability = (dayOfWeek: number, key: "startTime" | "endTime", value: string) => {
    setAvailability((prev) => {
      const existing = prev.find((slot) => slot.dayOfWeek === dayOfWeek);
      if (existing) {
        return prev.map((slot) =>
          slot.dayOfWeek === dayOfWeek ? { ...slot, [key]: value } : slot
        );
      }
      return [...prev, { dayOfWeek, startTime: "09:00", endTime: "17:00", [key]: value }];
    });
  };

  const toggleAvailabilityDay = (dayOfWeek: number) => {
    setAvailability((prev) => {
      const exists = prev.some((slot) => slot.dayOfWeek === dayOfWeek);
      if (exists) {
        return prev.filter((slot) => slot.dayOfWeek !== dayOfWeek);
      }
      return [...prev, { dayOfWeek, startTime: "09:00", endTime: "17:00" }];
    });
  };

  const saveAvailability = async () => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    setIsSaving(true);
    try {
      const baseUrl = getGatewayBaseUrl();
      await fetch(`${baseUrl}/api/buddy/users/${buddyId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: availability })
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveAutoAccept = async () => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    setIsSaving(true);
    try {
      const baseUrl = getGatewayBaseUrl();
      await fetch(`${baseUrl}/api/buddy/users/${buddyId}/auto-accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoAccept)
      });
    } finally {
      setIsSaving(false);
    }
  };

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
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Preference">New job requests</td>
                  <td className="p-4 text-white/70" data-label="Notes">Instant alerts when a seller requests help.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#12021f] ${prefs.jobRequests ? "bg-purple-600" : "bg-white/20"}`}
                      type="button"
                      aria-pressed={prefs.jobRequests}
                      onClick={() => updatePref("jobRequests")}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.jobRequests ? "translate-x-6" : "translate-x-1"}`} />
                      <span className="sr-only">
                        {prefs.jobRequests ? "On" : "Off"}
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Preference">Job reminders</td>
                  <td className="p-4 text-white/70" data-label="Notes">Remind you 30 minutes before your shift.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#12021f] ${prefs.jobReminders ? "bg-purple-600" : "bg-white/20"}`}
                      type="button"
                      aria-pressed={prefs.jobReminders}
                      onClick={() => updatePref("jobReminders")}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.jobReminders ? "translate-x-6" : "translate-x-1"}`} />
                      <span className="sr-only">
                        {prefs.jobReminders ? "On" : "Off"}
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Preference">Payment updates</td>
                  <td className="p-4 text-white/70" data-label="Notes">Notify when payouts are confirmed.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#12021f] ${prefs.paymentUpdates ? "bg-purple-600" : "bg-white/20"}`}
                      type="button"
                      aria-pressed={prefs.paymentUpdates}
                      onClick={() => updatePref("paymentUpdates")}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.paymentUpdates ? "translate-x-6" : "translate-x-1"}`} />
                      <span className="sr-only">
                        {prefs.paymentUpdates ? "On" : "Off"}
                      </span>
                    </button>
                  </td>
                </tr>
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
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Channel">Push notifications (FCM)</td>
                  <td className="p-4 text-white/70" data-label="Notes">Fastest delivery for in-app alerts.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10 ${prefs.channelPush ? "bg-purple-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}
                      type="button"
                      onClick={() => updatePref("channelPush")}
                    >
                      {prefs.channelPush ? "Enabled" : "Enable"}
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Channel">SMS fallback</td>
                  <td className="p-4 text-white/70" data-label="Notes">Send SMS when the app is offline.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10 ${prefs.channelSms ? "bg-purple-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}
                      type="button"
                      onClick={() => updatePref("channelSms")}
                    >
                      {prefs.channelSms ? "Enabled" : "Enable"}
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white" data-label="Channel">Email summaries</td>
                  <td className="p-4 text-white/70" data-label="Notes">Weekly recap of your jobs and earnings.</td>
                  <td className="p-4" data-label="Status">
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10 ${prefs.channelEmail ? "bg-purple-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}
                      type="button"
                      onClick={() => updatePref("channelEmail")}
                    >
                      {prefs.channelEmail ? "Enabled" : "Enable"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <h2 className="text-2xl font-bold text-white m-0">Availability calendar</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day, index) => {
              const slot = availability.find((item) => item.dayOfWeek === index);
              const enabled = Boolean(slot);
              return (
                <div key={day} className="flex flex-col md:flex-row md:items-center gap-3">
                  <button
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border ${enabled ? "bg-purple-600 text-white border-purple-500" : "bg-white/5 text-white/70 border-white/10"}`}
                    type="button"
                    onClick={() => toggleAvailabilityDay(index)}
                  >
                    {day}
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                      value={slot?.startTime ?? "09:00"}
                      onChange={(event) => updateAvailability(index, "startTime", event.target.value)}
                      disabled={!enabled}
                    />
                    <span className="text-white/40">to</span>
                    <input
                      type="time"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                      value={slot?.endTime ?? "17:00"}
                      onChange={(event) => updateAvailability(index, "endTime", event.target.value)}
                      disabled={!enabled}
                    />
                  </div>
                </div>
              );
            })}
            <button
              className="self-start mt-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-60"
              type="button"
              onClick={saveAvailability}
              disabled={isSaving}
            >
              Save availability
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <h2 className="text-2xl font-bold text-white m-0">Auto-accept rules</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                className="h-4 w-4 accent-purple-500"
                checked={autoAccept.autoAcceptEnabled}
                onChange={(event) =>
                  setAutoAccept((prev) => ({ ...prev, autoAcceptEnabled: event.target.checked }))
                }
              />
              Auto-accept requests that match your rules
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/60 uppercase tracking-widest">Max distance (km)</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  value={autoAccept.autoAcceptMaxKm}
                  onChange={(event) =>
                    setAutoAccept((prev) => ({ ...prev, autoAcceptMaxKm: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/60 uppercase tracking-widest">Max response (mins)</span>
                <input
                  type="number"
                  min={5}
                  max={60}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  value={autoAccept.autoAcceptMaxResponseMinutes}
                  onChange={(event) =>
                    setAutoAccept((prev) => ({
                      ...prev,
                      autoAcceptMaxResponseMinutes: Number(event.target.value)
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/60 uppercase tracking-widest">Minimum rating</span>
                <input
                  type="number"
                  min={3}
                  max={5}
                  step={0.1}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  value={autoAccept.autoAcceptMinRating}
                  onChange={(event) =>
                    setAutoAccept((prev) => ({
                      ...prev,
                      autoAcceptMinRating: Number(event.target.value)
                    }))
                  }
                />
              </div>
            </div>
            <button
              className="self-start mt-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-60"
              type="button"
              onClick={saveAutoAccept}
              disabled={isSaving}
            >
              Save auto-accept rules
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
