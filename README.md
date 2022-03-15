<p align="center">
	<a href="https://github.com/lboroWMEME-TeamProject/CCC-ProjectDocs"><img src="https://i.imgur.com/VwT4NrJ.png" width=650></a>
	<p align="center"> This repository is part of  a collection for the 21WSD001 Team Project. 
	All other repositories can be access below using the buttons</p>
</p>

<p align="center">
	<a href="https://github.com/lboroWMEME-TeamProject/CCC-ProjectDocs"><img src="https://i.imgur.com/rBaZyub.png" alt="drawing" height = 33/></a> 
	<a href="https://github.com/lboroWMEME-TeamProject/Dashboard"><img src="https://i.imgur.com/fz7rgd9.png" alt="drawing" height = 33/></a> 
	<a href="https://github.com/lboroWMEME-TeamProject/Cloud-Server"><img src="https://i.imgur.com/bsimXcV.png" alt="drawing" height = 33/></a> 
	<a href="https://github.com/lboroWMEME-TeamProject/Drone-Firmware"><img src="https://i.imgur.com/yKFokIL.png" alt="drawing" height = 33/></a> 
	<a href="https://github.com/lboroWMEME-TeamProject/Simulated-Drone"><img src="https://i.imgur.com/WMOZbrf.png" alt="drawing" height = 33/></a>
</p>

------------

# Dashboard
The main dashboard to view data from the connected drones
This will run in a browser and will make API and SocketIO calls to the server for information.

![dashboard](https://user-images.githubusercontent.com/58085441/147834486-c016d989-d8b6-4c45-bc7c-482ded009333.png)

------------

## Table of Contents

- [Installation](#Installation)
- [Documentation](#Documentation)
	- [Login](#Login)
	- [Server Connection](#Server-Connection)
	- [Drone Sidebar](#Drone-Sidebar)
	- [Main Page](#Main-Page)
	- [AI Camera](#AI-Camera)
	- [Thermal Camera](#Thermal-Camera)
	- [Radiation History](#Radiation-History)
	- [Pollution History](#Pollution-History)
	- [Gas History](#Gas-History)
	- [Maps](#Maps)
- [Test Plan](#Test-Plan)

------------

## Installation

This dashboard comes with the [cloud-server](https://github.com/lboroWMEME-TeamProject/Cloud-Server) project files. By installing the Cloud server you will automatically install this dashboard along with it.

However, should you wish to host the Dashboard separately from the Cloud-server you can do.

**Step 1 :** is to clone the repository to the device you plan to host it from. If you have git installed you can do so by running the following.

```
git clone https://github.com/lboroWMEME-TeamProject/Dashboard.git
```

**Step 2 :** is to edit the `main.js` file which is located in the `src/js` folder. You must change the `URI` variable on line 1 to point to the location of the cloud server.

```
var URI = window.location.protocol + "//" + window.location.host // <- CHANGE ME
var firstcheck = false
var servererror = false
var sock
```

**Step 3 :** Deploy the source files using any web server you require.

Some good recommendations:
- [Nginx](https://www.nginx.com/)
- [Apache](https://httpd.apache.org/)
- [Lighttpd](https://www.lighttpd.net/)
- [NodeJS](https://nodejs.org/en/)
- [Starlette](https://www.starlette.io/)


------------

## Documentation

<h3 align="center">Login</h1>
Users must first login and authenticate themselves before being allowed access to the data

<p align="center"><img src="https://github.com/lboroWMEME-TeamProject/Dashboard/blob/main/docs/img/Dashbaord%20Login.gif?raw=true" alt="drawing" /></p>

<h3 align="center">Server Connection</h1>
After successfully authenticating themselves the dashboard attempts to make a connection to the server. 

If the server is down or a successful connection can not be made an error message will pop up in the bottom right corner.

<p align="center"><img src="https://i.imgur.com/ZL10Hxl.png" alt="drawing" /></p>

If the dashboard connects successfully to the server it will retrieve a list of connected drones.

If no drones are connected it alerts the user and keeps waiting until a drone is connected.

<p align="center"><img src="https://i.imgur.com/GpYuimA.png" alt="drawing" /></p>

<h3 align="center">Drone Sidebar</h1>

When drones do connect up to the server you will be able to view them on the sidebar to the left. When hovered the drone will display its drone ID.

<p align="center"><img src="https://i.imgur.com/AE6x55V.png" alt="drawing" /> </p>

To view the data from a drone simply click on the drone in question. The dashboard will then attempt to make a connection via a websocket to access the drones information.

<h3 align="center">Main Page</h1>

<p align="left"><img src="https://user-images.githubusercontent.com/58085441/147834486-c016d989-d8b6-4c45-bc7c-482ded009333.png" alt="drawing" /> </p>

Once connected you will then be precented with the following display. On the left you will be able to see the 2 camera feeds from the drone, the object detection feed is on top and the thermal camera feed is on bottom.

To the right of that the user has access to all the sensor data from the drone.

The Main dashboard gives an overview of the data, if the user needs to look into a specific sensor in more detail they can using the menu bar at the top.

<h3 align="center">AI Camera</h1>
<p align="center"><img src="https://i.imgur.com/zXKiU9T.png" alt="drawing" /> </p>

By clicking the AI Camera tab you will be able to see a larger version of the feed from the main overview page.

<h3 align="center">Thermal Camera</h1>
<p align="center"><img src="https://i.imgur.com/TXwOMaA.png" alt="drawing" /> </p>

Similar to the AI Camera tab by clicking the Thermal Camera tab you will be able to see a larger version of the thermal camera feed from the drone.

<h3 align="center">Radiation History</h1>
<p align="center"><img src="https://i.imgur.com/MIAuclc.png" alt="drawing" /> </p>

The Radiation history tab shows the historical counts registered by the geiger counter on the drone. This is an interactive [plotly.js](https://plotly.com/javascript/) graph that allows you to zoom into data point, export images of the current graph and a whole suite of other features.

<h3 align="center">Pollution History</h1>
<p align="center"><img src="https://i.imgur.com/ideN953.png" alt="drawing" /> </p>

The Pollution History tab allows you a closer look at the pollution data from the main overview tab. This is an interactive [plotly.js](https://plotly.com/javascript/) graph that allows you to zoom into data point, export images of the current graph and a whole suite of other features.

<h3 align="center">Gas History</h1>
<p align="center"><img src="https://i.imgur.com/nxyBeN9.png" alt="drawing" /> </p>

The Gas History tab allows you a closer look at the gas data from the main overview tab. This is an interactive [plotly.js](https://plotly.com/javascript/) graph that allows you to zoom into data point, export images of the current graph and a whole suite of other features.

<h3 align="center">Maps</h1>

<p align="center"><img src="https://i.imgur.com/l13Zixj.png" alt="drawing" /> </p>

The maps tab allows you to view the current position of the drone as well as see key data points on the graph. The drone will plot a heat map of the radiation levels as it travels along. If at any point either the gas levels or particulate levels get too high it will mark that location on the map. Where the drone detects people it will plot that on the graph as well.

## Test Plan

<div align="center">

|Objective|Testing Strategy|Expected Output|Current Output|Pass/Fail|
|--|--|--|--|:--:|
|Display the drones that are connected connected to the server on the sidebar with their drone ID|Use the simulated drone to connect to the server and observer the result.|A new drone should show up on the side bar|A drone does show up on the side bar when a new drone connects|:heavy_check_mark:|
|Listen for data on the websocket of the selected drone|Use the simulated drone to connect a number of drones to the server and send data then select a drone and, see if the GUI displays the data in the console.|The data from the correct connected drone should appear in the console.|The data did appear in the console from the correct drone this will be displayed to the user using the GUI|:heavy_check_mark:|
|Display the data from the drone on the `Main` page of the GUI if the required format|Send data using the simulated drone tool and observe the page.|The data from the drone should appear in the main page. The feeds from the camera should be in its respective box's, the geiger dial should change depending on the reading. The other sensor values should be displayed correctly and graphs of the gas detected and the particulates detected should be plot.|Everything works as intended, the camera feeds are displayed in the correct box, the geiger dial changes with the data, the sensor values are displayed properly and the graphs are plotted as intended.|:heavy_check_mark:|
|Display the AI camera feed from the selected drone on the `AI Cam` page of the GUI|Send data using the simulated drone tool and observe the page.|A larger version of the AI cam should be shown.|Displays the AI Cam in a larger format.|:heavy_check_mark:|
|Display the Thermal camera feed from the selected drone of the `Thermal Cam` page of the GUI|Send data using the simulated drone tool and observe the page.|A larger version of the thermal camera should be shown|Displays the Thermal Cam in a larger format|:heavy_check_mark:|
|Display the Radiation history in CPM from the selected drone of the `Radiation History` page of the GUI|Send data using the simulated drone tool and observe the page.|Graph should be shown for the radiation in CPM|Shows Plotly.js graph that records historical radiation values|:heavy_check_mark:|
|Display the Pollution history from the selected drone of the `Pollution History` page of the GUI|Send data using the simulated drone tool and observe the page.|A larger version of the pollution graph should be shown|A larger version of the pollution graph is shown|:heavy_check_mark:|
|Display the Gas history from the selected drone of the `Gas History` page of the GUI|Send data using the simulated drone tool and observe the page.|A larger version of the Gas graph should be shown|A larger version of the gas graph is shown|:heavy_check_mark:|
|Display the drone's position on the map and tag critical reading on the map using the GPS data from the readings.|Send data using the simulated drone tool and observe the page.|A map should be shown the the drones current location, and dangerous locations should be highlighted.|*Feature not implemented yet*|❌|

</div>