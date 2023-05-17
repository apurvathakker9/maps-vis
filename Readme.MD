# Maps Visualization

This interface provides three types of maps:

- Google Maps
- Mapbox
- Here Maps

## Purpose
This small application aims to assist users in plotting points across different map bases. The problem with using different map bases, is that if you want to switch between them, the data added for a map will be lost. This application takes care of the plot state and regereates bases when the value of map is changed form the dropdown. It was initially developed as a project draft with the intention of creating a comprehensive solution for managers to make location-based decisions and perform various operations, such as clustering for operations.

## Technical Concept
This web application is built using JavaScript and utilizes Map APIs from Google, Mapbox, and Here Maps to plot points on different map interfaces. When a user enters data in the text area, which should be in valid JSON format, the text is parsed accordingly, and the points are plotted on the selected map from the dropdown menu. As more data is added in the text box, it gets appended to the previous list, allowing users to continuously add data to be plotted. The plots are represented using custom SVG markers.

## How to Use
In the repository, you will find two files: data-geojson.json and data-latLng.json.

To add an object based on latitude and longitude (lat/lng), you need to copy the data from the **data-latLng.json** file and paste it in the text area. After clicking "Update Data," zoom in or out on the maps to see red dots indicating the plotted points.

For lat lng values you can either plot -
- An object of lat lng values, OR
- An array of lat lng values

To use geoJSON, change the dropdown value to "geojson" and copy and paste the text from the **data-geojson.json** file. You will observe slightly different data in this case. *Please note that you may need to zoom out significantly to visualize the geoJSON data.*