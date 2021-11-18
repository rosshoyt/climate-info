import os
from os import path
from flask import Flask
from dotenv import load_dotenv
import requests

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.debug = 'DEBUG' in os.environ

# Load environment variables from .env if exists (during local debug mode)
if os.path.exists('.env'):
    load_dotenv('.env')

# API url TODO use flask.Config? https://flask.palletsprojects.com/en/2.0.x/api/#flask.Config
URL_NOAA_API = "https://www.ncdc.noaa.gov/cdo-web/api/v2"

@app.route('/')
def index():
    return app.send_static_file('index.html')

# API route for accessing NOAA NCDC CDO GSOM (Global summary of the month) climate data
@app.route('/api/gsom/<datatype_id>/<location_id>/<start_date>/<end_date>')
def get_gsom_data(datatype_id=None, location_id=None, start_date=None, end_date=None):
    # First, we'll setup the request URL
    url = URL_NOAA_API
    # Get average monthly temperature for Seattle
    url += "/data?"
    url += "datasetid=GSOM"
    url += "&datatypeid=" + datatype_id
    # Seattle city code:
    url += "&locationid=" + location_id
    # Get results in Farenheight
    url += "&units=standard"
    # Use June 2020
    url += "&startdate=" + start_date
    url += "&enddate=" + end_date

    # send the GET request with auth token header
    response = requests.get(
        url, headers={"token": os.environ['TOKEN_NOAA_NCDC_CDO']})
    
    # pass response to client
    return response.json()

@app.route('/api/noaa/data/daily/<data_type>/<location_id>/<start_date>/<end_date>')
def get_average_daily_max_temp_city(data_type=None, location_id=None, start_date=None, end_date=None):
    # Setup the request url
    url = URL_NOAA_API
    url += "/data?"
    url += "datasetid=GHCND"
    url += "&datatypeid=" + data_type
    # Location code:
    url += "&locationid=" + location_id
    # Get results in Farenheight
    url += "&units=standard"
    # Set time range
    url += "&startdate=" + start_date
    url += "&enddate=" + end_date
    url += "&limit=500"

    jsonResp = {} # the json object we'll return our results, or error message with
    
    # send the GET request with auth token header
    response = requests.get(url, headers={"token": os.environ['TOKEN_NOAA_NCDC_CDO']})
    
    return response.json()


@app.route('/api/locations/cities')
def get_cities():
    url = URL_NOAA_API
    url += "/locations?"
    url += "locationcategoryid=CITY"
    url += "&sortfield=name"
    url += "&sortorder=desc"
    # TODO get the rest of the available cities (~800 more) in second request
    url += "&limit=1000"

    # send the GET request with auth token header
    # TODO move NOAA API code to a separate class, add request method
    response = requests.get(
        url, headers={"token": os.environ['TOKEN_NOAA_NCDC_CDO']})

    results = response.json()["results"]

    return {'cities': results}
