import React from "react";
import { DatePicker } from "@material-ui/pickers";

function YearPicker({label, handleDateChange}) {

  return (
      <DatePicker
        views={["year"]}
        label={"Year"}
        value="1992"
        onChange={handleDateChange}
      />
  );
}

export default YearPicker;