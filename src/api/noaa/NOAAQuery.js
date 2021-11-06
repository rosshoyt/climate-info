export default class NOAAQuery {
    // 
    constructor(locationId, startDate, endDate){ 
        this.locationId = locationId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getURL() {
        return '/api/noaa/data/daily/' + this.locationId + '/' + this.startDate + '/' + this.endDate;
    }
}
