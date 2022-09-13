import { User } from "../types.ts"

export default (user: User): string => `
  <p>Dear ${user.firstName} ${user.lastName},</p>
  <p>Thank you for registering for an account at <a href="https://www.turtle.ox.ac.uk">www.turtle.ox.ac.uk</a>. Please click on the button below to activate your account.</p>
  <div class="button">
    <a href="${prod ? "https://www.turtle.ox.ac.uk" : "http://localhost:8000"}/verify/${user.username}/${user.token}">Activate My Account</a>
  </div>
  <p>(You have received this email because someone registered for an account on our site using your email address. If this wasn't you, you can safely ignore this message.)</p>
  <br>
  <p>Happy Turtling!</p>
  <p>The Oxford Turtle Robot</p>
`

const prod = Deno.env.get("prod") === "true"
