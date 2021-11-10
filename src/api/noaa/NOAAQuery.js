export default class NOAAQuery {
    // 
    constructor(locationId, startDate, endDate, name){ 
        this.locationId = locationId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.name = name; // 
    }

    getURL() {
        return '/api/noaa/data/daily/' + this.locationId + '/' + this.startDate + '/' + this.endDate;
    }
}
