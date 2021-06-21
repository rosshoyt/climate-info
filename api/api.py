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


@app.route('/api/temperature')
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

    # TODO get the average of all the weather stations returned
    # for key, value in response.json().items():
    #     if key == "results"
    #         for 
    #     print(key, value)

    return{'temperature': response.text}