import React from "react"

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  placeholder?: string
  className?: string
  value?: FormDataEntryValue | null
}

export type FormInputProps = FormFieldProps & { type: "text" | "email" | "password"; autoFocus?: boolean }

export type FormSelectProps = FormFieldProps & { children: JSX.Element[] }

export type FormOptionProps = {
  label: string
  value: string
  selectedValue?: string
}

export const FormInput = (props: FormInputProps): JSX.Element => {
  const value = typeof props.value === "string" ? props.value : ""
  return (
    <div className="form-group">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        required={props.required}
        placeholder={props.placeholder}
        value={value}
        autoFocus={props.autoFocus}
      />
    </div>
  )
}

export const FormSelect = (props: FormSelectProps): JSX.Element => (
  <div className="form-group">
    <label htmlFor={props.id}>{props.label}</label>
    <select id={props.id} name={props.id}>
      {props.children}
    </select>
  </div>
)

export const FormOption = (props: FormOptionProps): JSX.Element => (
  <option value={props.value} selected={props.value === props.selectedValue}>
    {props.label}
  </option>
)
