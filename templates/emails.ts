import { render } from "@react-email/render";
import React from "react";
import Welcome from "@/templates/Welcome";

export async function welcomeEmail(
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  },
  subject: string
) {
  const { firstName, lastName, email, password } = payload;

  const emailHtml = await render(
    React.createElement(Welcome, {
      name: `${firstName} ${lastName}`,
      password,
    })
  );

  return sendEmail(email, subject, emailHtml);
}

async function sendEmail(to: string, subject: string, content: string) {
  try {
    let payload = JSON.stringify({ to, subject, content });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/brevo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }
    );

    if (!response.ok) {
      console.error("Failed to send email", response);
    }
  } catch (error) {
    console.error("Email API Error:", error);
  }
}
