import React, { useEffect } from "react";
import { useState } from "react";
import { DatePicker } from "@material-ui/pickers";

function YearPicker({label="", initialYear=2021, handleDateChange}) {
  const [selectedDate, selectedDateChanged] = useState(new Date("01/01/2021"));

  useEffect(() => {
    selectedDateChanged(new Date("01/01/" + initialYear));
  }, []);

  function onChange(newDate) {
    console.log('In YearPicker.onChange, new date:', newDate.year());
    selectedDateChanged(newDate);
    handleDateChange(newDate.year());
  }
  return (
      <DatePicker
        views={["year"]}
        label={label}
        value={selectedDate}
        onChange={onChange}
      />
  );
}

export default YearPicker;