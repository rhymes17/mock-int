import { months, weeks } from "@/lib/utils";
import {
  addDays,
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getWeeksInMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";

const getCalendar = (date: Date) => {
  const dayOfFirst = getDay(startOfMonth(date));
  const noOfDays = getDaysInMonth(date);
  const weeks = getWeeksInMonth(date);
  const row = weeks,
    col = 7;

  const calendar: Array<number>[] = new Array(row);
  for (let i = 0; i < row; i++) {
    let week = new Array(col);
    for (let j = 0; j < col; j++) {
      week[j] = 0;
    }
    calendar[i] = week;
  }

  let currDay = 1;
  let hasCountingStarted = false;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (!hasCountingStarted && i == 0 && j == dayOfFirst) {
        calendar[i][j] = currDay;
        currDay++;
        hasCountingStarted = true;
        continue;
      }
      if (hasCountingStarted && currDay <= noOfDays) {
        calendar[i][j] = currDay;
        currDay++;
      }
    }
  }

  return calendar;
};

const Calendar = ({
  selectedDate,
  selectedMonth,
  selectedYear,
  setSelectedDate,
  setSelectedMonth,
  setSelectedYear,
}: {
  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [calendar, setCalendar] = useState<number[][]>(getCalendar(new Date()));

  const handlePreviosMonth = () => {
    setSelectedMonth((prev) => {
      if (prev === 0) {
        setSelectedYear(selectedYear - 1);
        return 11;
      } else {
        return prev - 1;
      }
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      if (prev === 11) {
        setSelectedYear(selectedYear + 1);
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  useEffect(() => {
    setCalendar(getCalendar(new Date(selectedYear, selectedMonth, 1)));
    setSelectedDate(
      getMonth(new Date()) === selectedMonth
        ? getDate(addDays(new Date(), 2))
        : 1
    );

    return () => {};
  }, [selectedMonth]);

  return (
    <div className="">
      <div className="flex justify-end gap-5 items-center mb-5">
        {selectedYear}
      </div>
      <div className="flex justify-end gap-5 items-center mb-5">
        {selectedMonth > getMonth(new Date()) && (
          <button
            className="p-2 border rounded-2xl"
            onClick={handlePreviosMonth}
          >
            previous
          </button>
        )}
        <h2>{months[selectedMonth]}</h2>
        {selectedMonth < getMonth(new Date()) + 1 && (
          <button className="p-2 border rounded-2xl" onClick={handleNextMonth}>
            Next
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-7 mb-5">
          {weeks.map((week, index) => (
            <div key={index} className="col-span-1 text-center">
              <h1 className="">{week}</h1>
            </div>
          ))}
        </div>
        {calendar.map((weeks, week) => (
          <div key={week} className={`grid`}>
            <div className="grid grid-cols-7">
              {weeks.map((date, day) => {
                const isPast =
                  new Date(selectedYear, selectedMonth, date) < new Date();
                const isDateToday = isToday(
                  new Date(selectedYear, selectedMonth, date)
                );
                return (
                  <div
                    onClick={() => {
                      if (!isPast) setSelectedDate(date);
                    }}
                    key={day}
                    className={`border col-span-1 aspect-square flex justify-end items-end px-5 text-xl cursor-pointer ${
                      isPast ? "text-black/40" : "text-black"
                    }  ${isDateToday ? "bg-black text-white" : ""}  ${
                      selectedDate === date ? "bg-pink-500 text-white" : ""
                    }`}
                  >
                    {date !== 0 && date}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
