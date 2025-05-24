"use client";

import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
import { timeSlots, toDateTimeISO } from "@/lib/utils";
import { SelectedTimeSlots, TimeSlot } from "@/types";
import { addDays, getDate, getMonth, getYear } from "date-fns";
import { useEffect, useState } from "react";

const Scheduler = ({
  setIsSchedulerOpen,
  setSelectedTimeSlotsAsIsoString,
}: {
  setIsSchedulerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTimeSlotsAsIsoString: React.Dispatch<React.SetStateAction<Date[]>>;
}) => {
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedDate, setSelectedDate] = useState(
    getDate(addDays(new Date(), 2))
  );

  const [selectedTimeSlots, setSelectedTimeSlots] =
    useState<SelectedTimeSlots | null>(null);

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

    const slotArray: Date[] = [];

    slotKeys.map((key) => {
      const map = selectedTimeSlots[key];
      let dateKey = key.split("-");
      const year = Number(dateKey[0]);
      const month = Number(dateKey[1]);
      const date = Number(dateKey[2]);
      map.forEach((val, timeKey) =>
        slotArray.push(new Date(toDateTimeISO(year, month, date, timeKey)))
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
    <div className="flex gap-8 ">
      <div className="flex-1">
        <Calendar
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedDate={setSelectedDate}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4 ">
        <div className=" grid grid-cols-4 gap-x-5 gap-y-2 px-8 pt-8">
          {timeSlots.map((timeSlot) => (
            <div
              key={timeSlot.key}
              className={`py-1 border h-[2.7rem] flex justify-center items-center border-black ${
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

        <div className="flex justify-end gap-6 items-end">
          {/* <h1 className="">Selected Time Slots</h1>
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
          </div> */}

          <div className="text-red-500 text-lg">Error</div>

          <Button
            title="Done"
            handleClick={() => {
              setIsSchedulerOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
