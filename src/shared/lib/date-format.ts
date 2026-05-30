export function parseDisplayDate(value: string): Date | null {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }

  return parsed;
}

export function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export const weekdayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export function getMondayFirstWeekday(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function buildCalendarCells(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const leadingEmpty = getMondayFirstWeekday(firstOfMonth);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{
    date: Date;
    inCurrentMonth: boolean;
  }> = [];

  for (let index = leadingEmpty - 1; index >= 0; index -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - index),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - leadingEmpty - daysInMonth + 1;
    cells.push({
      date: new Date(year, month + 1, nextDay),
      inCurrentMonth: false,
    });
  }

  return cells;
}
