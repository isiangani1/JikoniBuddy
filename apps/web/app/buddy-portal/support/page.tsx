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
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      
        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Support channels</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white">
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

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Open tickets</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white">
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
