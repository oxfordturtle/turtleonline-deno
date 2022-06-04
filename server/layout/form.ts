import { element } from "../utils/element.ts"

export type FormField = FormInputField | FormSelectField

type FormFieldBase = {
  id: string
  label: string
  required: boolean
  placeholder?: string
  className?: string
}

export type FormInputField = FormFieldBase & { type: "text" | "email" | "password"; value?: string }

export type FormSelectField = FormFieldBase & { type: "select"; value?: string; options: Option[] }

type Option = {
  label: string
  value: string
}

export const formField = (formField: FormField) =>
  element("div", { className: "form-group" }, [label(formField), input(formField)])

const label = (formField: FormField) => element("label", { for: formField.id }, formField.label)

const input = (formField: FormField) => (formField.type === "select" ? select(formField) : textInput(formField))

const textInput = (formField: FormInputField) =>
  element("input", {
    type: formField.type,
    id: formField.id,
    name: formField.id,
    required: formField.required,
    placeholder: formField.placeholder,
  })

const select = (formField: FormSelectField) =>
  element(
    "select",
    { id: formField.id, name: formField.id },
    formField.options.map((o) => option(o, o.value === formField.value)).join()
  )

const option = (option: Option, selected: boolean) => element("option", { value: option.value, selected }, option.label)
