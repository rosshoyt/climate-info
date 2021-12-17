export class Timeseries {
  constructor(uid, year=2000, color= '#9900EF') {
    this.id = uid;
    this.year = year;
    this.color = color;
    this.colorSelectorOpen = false;
    this.data = [];
    this.loading = false;
    this.errorMessage = undefined;
    this.queryString = undefined;
  }
}
