const WAITLIST_URL = import.meta.env.VITE_WAITLIST_API_URL as string;

export async function joinWaitlist(email: string, walletAddress?: string): Promise<void> {
  const res = await fetch(WAITLIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, walletAddress }),
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}
