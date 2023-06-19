export const getFormField = (id: string, formData: FormData): string | null => {
  const value = formData.get(id);
  return typeof value === "string" ? value : null;
};
