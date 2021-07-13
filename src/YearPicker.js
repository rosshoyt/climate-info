import React from "react";
import { DatePicker } from "@material-ui/pickers";

function YearPicker({handleDateChange}) {

  return (
      <DatePicker
        views={["year"]}
        label="Compare to another year:"
        value="1992"
        onChange={handleDateChange}
      />
  );
}

export default YearPicker;