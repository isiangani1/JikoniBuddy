import Link from "next/link";

const threads = [
  {
    id: "thread-1",
    seller: "Chef Amani",
    lastMessage: "Prep started. Delivery on track for 6:30 PM.",
    time: "2m ago"
  },
  {
    id: "thread-2",
    seller: "Nairobi Kitchen",
    lastMessage: "Can you arrive 15 minutes earlier today?",
    time: "15m ago"
  },
  {
    id: "thread-3",
    seller: "Swahili Spice",
    lastMessage: "Packaging done. Waiting on rider confirmation.",
    time: "1h ago"
  }
];

const messages = [
  {
    id: "msg-1",
    sender: "You",
    body: "On my way to the kitchen, ETA 20 minutes.",
    time: "3:12 PM"
  },
  {
    id: "msg-2",
    sender: "Chef Amani",
    body: "Perfect. Please start with packaging when you arrive.",
    time: "3:15 PM"
  },
  {
    id: "msg-3",
    sender: "You",
    body: "Got it. I will update you after the first batch.",
    time: "3:18 PM"
  }
];

export default function BuddyPortalMessagesPage() {
  return (
    <>
      <main className="buddy-chat">
        

        <section className="buddy-chat-grid">
          <aside className="chat-sidebar">
            <h2>Active threads</h2>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>Last message</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {threads.map((thread) => (
                    <tr key={thread.id}>
                      <td data-label="Seller">{thread.seller}</td>
                      <td data-label="Last message">{thread.lastMessage}</td>
                      <td data-label="Time">{thread.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>

          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <h2>Chef Amani</h2>
                <p className="muted">Packaging shift · Westlands</p>
              </div>
              <span className="status-pill status-open">Live</span>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-bubble ${
                    message.sender === "You" ? "self" : ""
                  }`}
                >
                  <span>{message.sender}</span>
                  <p>{message.body}</p>
                  <span className="muted">{message.time}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input placeholder="Write a quick update..." />
              <button className="primary" type="button">
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
