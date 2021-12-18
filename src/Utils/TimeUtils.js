import moment from "moment";

export function getReadableTimeString(mm_dd){
  return moment(mm_dd, 'MM-DD').format("MMMM Do");
}