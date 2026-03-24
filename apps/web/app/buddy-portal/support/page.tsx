import Link from "next/link";

const supportChannels = [
  {
    channel: "WhatsApp Support",
    detail: "+254 700 123 456",
    hours: "8am - 9pm"
  },
  {
    channel: "Email Support",
    detail: "support@jikoni.buddy",
    hours: "24/7"
  },
  {
    channel: "Dispute Desk",
    detail: "disputes@jikoni.buddy",
    hours: "Mon - Fri"
  }
];

const openTickets = [
  {
    id: "JB-2041",
    subject: "Payment delay",
    status: "Open",
    lastUpdate: "Mar 19, 2026"
  },
  {
    id: "JB-2038",
    subject: "Shift conflict",
    status: "Awaiting response",
    lastUpdate: "Mar 17, 2026"
  }
];

export default function BuddyPortalSupportPage() {
  return (
    <>
      <main className="category-page">
      
        <section className="section fade-in">
          <h2>Support channels</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Contact</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {supportChannels.map((channel) => (
                  <tr key={channel.channel}>
                    <td data-label="Channel">{channel.channel}</td>
                    <td data-label="Contact">{channel.detail}</td>
                    <td data-label="Hours">{channel.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Open tickets</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Last update</th>
                </tr>
              </thead>
              <tbody>
                {openTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td data-label="Ticket">{ticket.id}</td>
                    <td data-label="Subject">{ticket.subject}</td>
                    <td data-label="Status">
                      <span className="status-pill">{ticket.status}</span>
                    </td>
                    <td data-label="Last update">{ticket.lastUpdate}</td>
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
