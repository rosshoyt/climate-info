class APIQuery {
    // TODO set URL values elsewhere, store passed parameters as object fields
    constructor(location_id, start_date, end_date){
        this.url = "https://www.ncdc.noaa.gov/cdo-web/api/v2"
        // First, we'll setup the request URL
        this.url = URL_NOAA_API
        // Get average monthly temperature for location during time range
        this.url += "/data?"
        this.url += "datasetid=GHCND"
        this.url += "&datatypeid=TMAX"
        // Location code:
        this.url += "&locationid=" + location_id
        // Get results in Farenheight
        this.url += "&units=standard"
        // Set time range
        this.url += "&startdate=" + start_date
        this.url += "&enddate=" + end_date
        this.url += "&limit=500"
    }
} 
