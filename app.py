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


# shared method to send requests using NOAA CDO token
def sendNoaaCdoRequest(url):
  return requests.get(
    url, headers={"token": os.environ['TOKEN_NOAA_NCDC_CDO']})

def responseContainsJSON(response):
    return response.headers.get('content-type') == 'application/json'

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')


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
    url += "&limit=1000"

    # send the GET request with auth token header
    response = sendNoaaCdoRequest(url)
    
    if responseContainsJSON(response):    
        return response.json()
    else:
        return { 'error': response.status_code }

@app.route('/api/locations/get/stations/<location_id>')
def get_stations_in_location(location_id=None):
    
    # print('getting the stations for location', location_id)
    results_list = []
    total_count = 1000
    
    while len(results_list) < total_count:
        url = url = URL_NOAA_API
        url += "/stations?"
        url += "locationid=" + location_id
        #url += "&sortfield=name"
        #url += "&sortorder=asc"
        url += "&limit=1000"
        url += "&offset=" + str(len(results_list))

        response = sendNoaaCdoRequest(url)

        if responseContainsJSON(response):
            
            response_json = response.json()

            # update the total count of results
            total_count = response_json["metadata"]["resultset"]["count"]
            
            # add the results to the list
            results_list.extend(response_json["results"])
        else:
            return { 'error': response.status_code }

    return {'stations': results_list}

@app.route('/api/locations/cities')
def get_cities():
    # print('getting cities')
    results_list = []
    total_count = 1000
    
    while len(results_list) < total_count:
        url = URL_NOAA_API
        url += "/locations?"
        url += "locationcategoryid=CITY"
        url += "&sortfield=name"
        url += "&sortorder=asc"
        url += "&limit=1000"
        url += "&offset=" + str(len(results_list))

        # send the GET request with auth token header
        # TODO move NOAA API code to a separate class, add request method
        response = sendNoaaCdoRequest(url)

        if responseContainsJSON(response):
            response_json = response.json()
        
            # TODO handle errors (send error result json through to client)
            # update the total count of results
            total_count = response_json["metadata"]["resultset"]["count"]
        
            # add the results to the list
            results_list.extend(response_json["results"])
        else:
            return { 'error': response.status_code }

    return {'cities': results_list}
