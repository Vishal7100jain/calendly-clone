import { AvailableDate } from "@/types";

interface DateSelectorProps {
  dates: AvailableDate[];
  selectedDate: string;
  isLoading: boolean;
  onSelectDate: (date: string) => void;
}

export const DateSelector = ({
  dates,
  selectedDate,
  isLoading,
  onSelectDate,
}: DateSelectorProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading available dates...
      </div>
    );
  }

  if (dates.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        Available Dates
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {dates.map((dateObj, idx) => (
          <button
            key={idx}
            onClick={() => onSelectDate(dateObj.date)}
            className={`p-3 border rounded-lg text-center transition-all ${
              selectedDate === dateObj.date
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-blue-50 border-gray-300 text-black"
            }`}
          >
            <div className="font-medium">{dateObj.date}</div>
            {dateObj.available_slots !== undefined && (
              <div className="text-xs mt-1 opacity-75">
                {dateObj.available_slots} slots available
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
