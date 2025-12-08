import { format } from "date-fns";

const monthMap: Record<string, number> = {
  JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
  JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10,  DEZ: 11,

  JAN_EN: 0, FEB: 1, MAR_EN: 2, APR: 3, MAY: 4, JUN_EN: 5,
  JUL_EN: 6, AUG: 7, SEP: 8, OCT: 9, NOV_EN: 10, DEC: 11
};

const parseMonthAbbrev = (abbrev: string): number | null => {
  if (!abbrev) return null;
  const key = abbrev.trim().toUpperCase();

  if (monthMap[key] !== undefined) return monthMap[key];

  const first3 = key.slice(0, 3);
  return monthMap[first3] ?? null;
};

export const formatMonthReference = (dateString: string): string => {
  if (!dateString) return "";

  const ddmmyyyy = /^\d{2}\/\d{2}\/\d{4}$/;
  if (ddmmyyyy.test(dateString)) return dateString;

  const abbrMatch = /^([A-Za-zÀ-ú]{3,})\/(\d{4})$/.exec(dateString);
  if (abbrMatch) {
    const [, monthPart, yearStr] = abbrMatch;
    const monthIndex = parseMonthAbbrev(monthPart);
    const year = Number(yearStr);

    if (monthIndex !== null && !Number.isNaN(year)) {
      const d = new Date(year, monthIndex, 1);
      return format(d, "dd/MM/yyyy");
    }
  }

  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return format(d, "dd/MM/yyyy");
    }
  } catch {}

  return dateString;
};
