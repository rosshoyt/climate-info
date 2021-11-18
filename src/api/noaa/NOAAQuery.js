export default class NOAAQuery {
    // 
    constructor(dataType, locationId, startDate, endDate, name){ 
        this.dataType = dataType;
        this.locationId = locationId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.name = name; 
        // this.id = id; TODO
    }

    getURL() {
        return '/api/noaa/data/daily/'
            + this.dataType + '/' 
            + this.locationId + '/' 
            + this.startDate + '/' 
            + this.endDate;
    }
}
