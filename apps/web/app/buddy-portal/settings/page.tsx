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
      <main className="category-page">
      

        <section className="section fade-in">
          <h2>Notification preferences</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Preference</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notificationOptions.map((option) => (
                  <tr key={option.title}>
                    <td data-label="Preference">{option.title}</td>
                    <td data-label="Notes">{option.note}</td>
                    <td data-label="Status">
                      <button
                        className={`table-toggle ${option.enabled ? "on" : "off"}`}
                        type="button"
                        aria-pressed={option.enabled}
                      >
                        <span className="toggle-knob" />
                        <span className="toggle-text">
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

        <section className="section fade-in">
          <h2>Delivery channels</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryChannels.map((channel) => (
                  <tr key={channel.title}>
                    <td data-label="Channel">{channel.title}</td>
                    <td data-label="Notes">{channel.note}</td>
                    <td data-label="Status">
                      <button className="ghost" type="button">
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
