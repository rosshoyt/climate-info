import os
import time
from flask import Flask
from dotenv import load_dotenv
import requests
from conf import * 

app = Flask(__name__)

# Credentials
load_dotenv('.env')

@app.route('/api/time')
def get_current_time():
    return{'time': time.time()}


@app.route('/api/temperature/average')
def get_average_monthly_temperature():
    # First, we'll setup the request URL
    url = URL_NOAA_NCDC_CDO
    # Get average monthly temperature for Seattle
    url += "/data?"
    url += "datasetid=GSOM"
    url += "&datatypeid=TAVG"
    # Seattle city code:
    url += "&locationid=CITY:US530018"
    # Get results in Farenheight
    url += "&units=standard"
    # Use June 2020
    url += "&startdate=2020-06-01"
    url += "&enddate=2020-06-30"


    # send the GET request with auth token header
    response = requests.get(url, headers ={"token" : os.getenv('TOKEN_NOAA_NCDC_CDO')})

    results = response.json()["results"]

    avgTemp = 0
    for entry in results:
        avgTemp += entry["value"]

    avgTemp = avgTemp / len(results)    
    print("Average temp for Seattle in June 2020 was ", avgTemp)

    return{'temperature': avgTemp}


@app.route('/api/temperature/max')
def get_average_daily_max_temp_city():
    # First, we'll setup the request URL
    url = URL_NOAA_NCDC_CDO
    # Get average monthly temperature for Seattle
    url += "/data?"
    url += "datasetid=GHCND"
    url += "&datatypeid=TMAX"
    # Seattle city code:
    url += "&locationid=CITY:US530018"
    # Get results in Farenheight
    url += "&units=standard"
    # Use June 2020
    url += "&startdate=2020-06-01"
    url += "&enddate=2020-06-30"
    url += "&limit=500"
    
    # send the GET request with auth token header
    # TODO move NOAA API code to a separate class, add request method
    response = requests.get(url, headers ={"token" : os.getenv('TOKEN_NOAA_NCDC_CDO')})

    results = response.json()["results"]

    # maps dates to TMAX data
    dateAverages = {}
    # maps dates to the number of TMAX data samples for the date, used to calculate average TMAX for day  
    dateNumEntries = {} 
    
    # sum the total max temperatures for each date and track the number of data samples per date
    for entry in results:
        date = entry["date"]     
        
        if date in dateAverages:
            dateNumEntries[date] += 1
            dateAverages[date] += entry["value"]
        else:
            dateNumEntries[date] = 1
            dateAverages[date] = entry["value"]

    # calculate the average TMAX and store in dateAverages
    for date, numEntries in dateNumEntries.items():
        if date in dateAverages:
            dateAverages[date] = dateAverages[date] / numEntries

    print("Date Temp Totals", dateAverages)
    print("Num entries per date", dateNumEntries)

    return dateAverages