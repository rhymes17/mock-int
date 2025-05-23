"use client";

import { months, timeSlots, toDateTimeISO, weeks } from "@/lib/utils";
import { SelectedTimeSlots, TimeSlot } from "@/types";
import {
  addDays,
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getWeeksInMonth,
  getYear,
  startOfMonth,
} from "date-fns";
import React, { useEffect, useState } from "react";

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

const Scheduler = () => {
  const [calendar, setCalendar] = useState<number[][]>(getCalendar(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedDate, setSelectedDate] = useState(
    getDate(addDays(new Date(), 2))
  );

  const [selectedTimeSlots, setSelectedTimeSlots] =
    useState<SelectedTimeSlots | null>(null);

  const [selectedTimeSlotsAsIsoString, setSelectedTimeSlotsAsIsoString] =
    useState<string[]>([]);

  console.log({
    date: new Date(selectedYear, selectedMonth, selectedDate),
    selectedTimeSlotsAsIsoString,
  });

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

  const handleSelectSlot = (slot: TimeSlot) => {
    const dateKey = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    const timeSlot = slot.value;

    setSelectedTimeSlots((prev) => {
      const newSlots = { ...prev };
      const timeMap = new Map(newSlots[dateKey] || []);

      if (!timeMap.has(timeSlot)) {
        timeMap.set(timeSlot, true);
      } else {
        timeMap.delete(timeSlot);
      }
      newSlots[dateKey] = timeMap;

      return newSlots;
    });
  };

  useEffect(() => {
    const slotKeys = selectedTimeSlots ? Object.keys(selectedTimeSlots) : [];
    if (!slotKeys || !selectedTimeSlots) {
      return;
    }

    const slotArray: string[] = [];

    slotKeys.map((key) => {
      const map = selectedTimeSlots[key];
      let dateKey = key.split("-");
      const year = Number(dateKey[0]);
      const month = Number(dateKey[1]);
      const date = Number(dateKey[2]);
      map.forEach((val, timeKey) =>
        slotArray.push(toDateTimeISO(year, month, date, timeKey))
      );
    });

    setSelectedTimeSlotsAsIsoString(slotArray);
  }, [selectedTimeSlots]);

  const checkIfSlotSelected = (timeSlot: string) => {
    const dateKey = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    if (!selectedTimeSlots) return false;

    const timeMap = selectedTimeSlots[dateKey];

    if (!timeMap) return false;

    return timeMap.has(timeSlot);
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
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
            <button
              className="p-2 border rounded-2xl"
              onClick={handleNextMonth}
            >
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
                  return (
                    <div
                      onClick={() => {
                        if (!isPast) setSelectedDate(date);
                      }}
                      key={day}
                      className={`border col-span-1 aspect-square flex justify-end items-end px-5 text-xl cursor-pointer ${
                        isPast ? "text-black/40" : "text-black"
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

      <div className="flex-1 flex flex-col gap-8">
        <div className="">
          <h1 className="">Selected Time Slots</h1>
          <div className="h-[8rem] w-full border rounded-xl flex flex-wrap gap-2 p-2">
            {selectedTimeSlotsAsIsoString.map((timeSlot) => {
              const date = new Date(timeSlot).toDateString();
              const time = new Date(timeSlot).toLocaleTimeString();
              return (
                <div
                  key={timeSlot}
                  className={` border text-center border-black 
                      : "bg-black text-white"
                   rounded-xl cursor-pointer h-fit py-2 px-2`}
                >
                  {date} {time}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-full grid grid-cols-4 gap-x-5 gap-y-2 px-8">
          {timeSlots.map((timeSlot) => (
            <div
              key={timeSlot.key}
              className={`py-1 border text-center border-black ${
                checkIfSlotSelected(timeSlot.value)
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-xl cursor-pointer`}
              onClick={() => handleSelectSlot(timeSlot)}
            >
              {timeSlot.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
