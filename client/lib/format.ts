export function formatDate(value: string, month: "short" | "long" = "short") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric", timeZone: "UTC" });
}
