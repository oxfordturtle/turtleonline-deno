import { type IResult, sendSimpleMail } from "sendgrid";
import { type User } from "../types.ts";
import verifyEmail from "../emails/verify.ts";
import credentialsEmail from "../emails/credentials.ts";

export const sendVerifyEmail = (user: User): Promise<IResult> =>
  sendEmail(
    "Oxford Turtle System: Confirm Email Address",
    user.email,
    verifyEmail(user)
  );

export const sendCredentialsEmail = (user: User): Promise<IResult> =>
  sendEmail(
    "Oxford Turtle System: Reset Password",
    user.email,
    credentialsEmail(user)
  );

const sendEmail = async (
  subject: string,
  to: string,
  content: string
): Promise<IResult> =>
  sendSimpleMail(
    {
      subject,
      to: [{ email: prod() ? to : "merivale@gmail.com" }],
      from: { email: "amyas.merivale@philosophy.ox.ac.uk" },
      content: [{ type: "text/html", value: await wrapContent(content) }],
    },
    { apiKey: apiKey() }
  );

const wrapContent = async (content: string): Promise<string> => `
  <!doctype html>
  <html>
    <head>
      <style>${await Deno.readTextFile("./public/css/email.css")}</style>
    </head>
    <body>${content}</body>
  </html>
`;

const apiKey = (): string => Deno.env.get("SENDGRID_KEY") ?? "";

const prod = (): boolean => Deno.env.get("PROD") === "true";
