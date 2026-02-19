export function getTodayId(timezone = "America/Sao_Paulo"): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone })
    .format(new Date());
}