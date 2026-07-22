export function getContestStatus({
  endTime,
  startTime,
}: {
  endTime: string;
  startTime: string;
}) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) {
    return {
      status: "UPCOMING",
      label: "Starts in",
      remaining: start - now,
    };
  }

  if (now <= end) {
    return {
      status: "ONGOING",
      label: "Ends in",
      remaining: end - now,
    };
  }

  return {
    status: "ENDED",
    label: "Ended",
    remaining: 0,
  };
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
