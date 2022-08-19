export const getFormField = (id: string, formData: FormData): string | undefined => {
  const value = formData.get(id)
  return typeof value === "string" ? value : undefined
}
