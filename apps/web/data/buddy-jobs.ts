export const currentJob = {
  id: "job-204",
  seller: "Nairobi Kitchen",
  taskType: "Packaging",
  location: "Westlands",
  timeWindow: "14:00 - 17:00",
  pay: 800,
  status: "in_progress" as const,
  statuses: [
    "requested",
    "accepted",
    "in_progress",
    "completed",
    "paid"
  ] as const
};
