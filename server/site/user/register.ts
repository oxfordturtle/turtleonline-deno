import { type ParsedRequest } from "../../request.ts"
import page from "../../layout/page.ts"
import { formField } from "../../layout/form.ts"
import { htmlResponse } from "../../utils/response.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, header, main()))

const header = `
  <h1>Register</h1>
  <p>Creating an account on this site is free and easy. Simply fill in the form below and click ‘Register’. You will then be able to upload and share your Turtle programs with others, save your online system preferences, create and join programming courses, and access our free course materials.</p>
`

const main = () => `
  <div class="form">
    <form name="user_register" method="post">
      <div class="columns">
        <div class="column">
          ${username}
        </div>
        <div class="column">
          ${email}
        </div>
      </div>
      <div class="columns">
        <div class="column">
          ${password1}
        </div>
        <div class="column">
          ${password2}
        </div>
      </div>
      <div class="columns">
        <div class="column">
          ${firstName}
        </div>
        <div class="column">
          ${lastName}
        </div>
      </div>
      ${accountType}
      ${guardian}
      <div class="columns">
        <div class="column">
          ${schoolName}
        </div>
        <div class="column">
          ${schoolPostcode}
        </div>
      </div>
      <div class="form-buttons">
        <button type="submit" class="green button">Register</button>
      </div>
    </form>
  </div>
`

const username = formField({
  id: "username",
  label: "Username (choose any)",
  type: "text",
  required: true,
})

const email = formField({
  id: "email",
  label: "Email Address",
  type: "email",
  required: true,
})

const password1 = formField({
  id: "password1",
  label: "Password",
  type: "password",
  required: true,
})

const password2 = formField({
  id: "password2",
  label: "Repeat Password",
  type: "password",
  required: true,
})

const firstName = formField({
  id: "firstName",
  label: "First Name",
  type: "text",
  required: true,
})

const lastName = formField({
  id: "lastName",
  label: "Last Name",
  type: "text",
  required: true,
})

const accountType = formField({
  id: "accountType",
  label: "Account Type",
  type: "select",
  options: [
    { label: "This account is for me, and I am at least 13 years old", value: "1" },
    { label: "This account is for a child under 13, and I am their legal guardian", value: "2" },
  ],
  value: "1",
  required: true,
})

const guardian = formField({
  id: "guardian",
  label: "Full Name of Parent/Guardian",
  type: "text",
  required: true,
})

const schoolName = formField({
  id: "schoolName",
  label: "School Name (optional)",
  type: "text",
  required: false,
})

const schoolPostcode = formField({
  id: "schoolPostcode",
  label: "School Postcode (optional)",
  type: "text",
  required: false,
})
