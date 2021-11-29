# ClimateInfo.US
### Explore and visualize historical climate data from the NOAA Climate Data Online database.
### Compare temperature, rain, and snowfall data from locations around the world across years!
####
<br>

## Site info:
### Website built with MaterialUI, React, and Flask, hosted on Heroku
### Uses Nivo charts and Zustand state management libraries
### Climate Data source: NOAA Climate Data Online API (https://www.ncdc.noaa.gov/cdo-web/)
<br>

## Developers:
## Setup

1. `pip3 install -r requirements.txt`
2. `npm install`

## Running Locally

1. `npm run build`
2. `heroku local`

The application will be running at http://localhost:5000.

## Deploying

First, create your app on Heroku. Then:

1. `heroku git:remote -a {YOUR_APP_NAME}`
2. `heroku buildpacks:set heroku/python`
3. `heroku buildpacks:add --index 1 heroku/nodejs`
4. `git push heroku master`

## Project Structure

* Flask server is at `app.py`
* React components in `src/`
