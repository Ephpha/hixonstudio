import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const TO_EMAIL = "matthix96@gmail.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Hixon Studio <onboarding@resend.dev>";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!apiKey) {
    return Response.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? "").trim();
  const honeypot = String(data.company ?? "").trim();

  // Silently accept honeypot triggers — bot thinks it succeeded
  if (honeypot) {
    return Response.json({ ok: true });
  }

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return Response.json(
      { error: "That email doesn't look right." },
      { status: 400 }
    );
  }

  if (message.length > 5000) {
    return Response.json(
      { error: "Message is too long (max 5000 characters)." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  const finalSubject = subject || `New message from ${name}`;

  const textBody =
    `From: ${name} <${email}>\n` +
    `Subject: ${subject || "(no subject)"}\n` +
    `\n` +
    `${message}\n` +
    `\n` +
    `— Sent from hixon.studio/contact`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[hixon.studio] ${finalSubject}`,
      text: textBody,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return Response.json(
        { error: "Could not send right now. Try again in a minute." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return Response.json(
      { error: "Could not send right now. Try again in a minute." },
      { status: 502 }
    );
  }
}
