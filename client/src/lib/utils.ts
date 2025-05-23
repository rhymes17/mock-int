import { TimeSlot } from "@/types";

export function toDateTimeISO(
  year: number,
  month: number,
  day: number,
  time12h: string
): string {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(year, month, day, hours, minutes);
  return date.toISOString();
}

export const weeks = ["S", "M", "T", "W", "Th", "F", "S"];
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const timeSlots: TimeSlot[] = [
  { key: "00:00", value: "12:00 AM" },
  { key: "00:30", value: "12:30 AM" },
  { key: "01:00", value: "1:00 AM" },
  { key: "01:30", value: "1:30 AM" },
  { key: "02:00", value: "2:00 AM" },
  { key: "02:30", value: "2:30 AM" },
  { key: "03:00", value: "3:00 AM" },
  { key: "03:30", value: "3:30 AM" },
  { key: "04:00", value: "4:00 AM" },
  { key: "04:30", value: "4:30 AM" },
  { key: "05:00", value: "5:00 AM" },
  { key: "05:30", value: "5:30 AM" },
  { key: "06:00", value: "6:00 AM" },
  { key: "06:30", value: "6:30 AM" },
  { key: "07:00", value: "7:00 AM" },
  { key: "07:30", value: "7:30 AM" },
  { key: "08:00", value: "8:00 AM" },
  { key: "08:30", value: "8:30 AM" },
  { key: "09:00", value: "9:00 AM" },
  { key: "09:30", value: "9:30 AM" },
  { key: "10:00", value: "10:00 AM" },
  { key: "10:30", value: "10:30 AM" },
  { key: "11:00", value: "11:00 AM" },
  { key: "11:30", value: "11:30 AM" },
  { key: "12:00", value: "12:00 PM" },
  { key: "12:30", value: "12:30 PM" },
  { key: "13:00", value: "1:00 PM" },
  { key: "13:30", value: "1:30 PM" },
  { key: "14:00", value: "2:00 PM" },
  { key: "14:30", value: "2:30 PM" },
  { key: "15:00", value: "3:00 PM" },
  { key: "15:30", value: "3:30 PM" },
  { key: "16:00", value: "4:00 PM" },
  { key: "16:30", value: "4:30 PM" },
  { key: "17:00", value: "5:00 PM" },
  { key: "17:30", value: "5:30 PM" },
  { key: "18:00", value: "6:00 PM" },
  { key: "18:30", value: "6:30 PM" },
  { key: "19:00", value: "7:00 PM" },
  { key: "19:30", value: "7:30 PM" },
  { key: "20:00", value: "8:00 PM" },
  { key: "20:30", value: "8:30 PM" },
  { key: "21:00", value: "9:00 PM" },
  { key: "21:30", value: "9:30 PM" },
  { key: "22:00", value: "10:00 PM" },
  { key: "22:30", value: "10:30 PM" },
  { key: "23:00", value: "11:00 PM" },
  { key: "23:30", value: "11:30 PM" },
];
