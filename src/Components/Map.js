import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    FormControl,
    InputLabel,
    Slider,
    Typography,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

//import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import GoogleMapReact from 'google-map-react';



const quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const mapsKey = "AIzaSyCC9UKV-RIkf01i_oZdYRrIOto_t7Z3irk";

const Map = () => {
    const location = useLocation();
    const { selectedOption, quakesNum, locationVal } = location.state;

    const [quakes, setQuakes] = useState([]);

    const [locationFetched, setLocationFetched] = useState(false);

    const [mylat, setMylat] = useState(null);
    const [mylong, setMylong] = useState(null);


    // center of US by default
    //var mylat = 16.33255;
    //var mylong = -168.03100;


    const navigate = useNavigate();

    const routeChange = () => {
        let path = `/home`;
        navigate(path);
    };

    const getDist = (x1,x2, y1, y2) => {

        var R = 6371;
        var l1 = x1 * Math.PI/180;
        var l2 = x2 * Math.PI/180;
        var dl = (x2 - x1) * Math.PI/180;
        var dr = (y2 - y1) * Math.PI/180;
        
        var a = Math.sin(dl/2) * Math.sin(dl/2) + Math.cos(l1) * Math.cos(l2) * Math.sin(dr/2) * Math.sin(dr/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
        
    }



    const fetchQuakes = async (mylat, mylong) => {
        fetch(quakesURL, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(quakes => {

            if (selectedOption === 'proximity') {
                const sortedQuakes = quakes['features'].sort((a, b) => {
                    const distA = getDist(mylat, a['geometry']['coordinates'][1], mylong, a['geometry']['coordinates'][0]);
                    const distB = getDist(mylat, b['geometry']['coordinates'][1], mylong, b['geometry']['coordinates'][0]);
                    return distA - distB;
                });
                
                const filteredQuakes = sortedQuakes.slice(0, quakesNum);
                setQuakes(filteredQuakes);
                
            }

            else if (selectedOption === 'magnitude') {
                const sortedQuakes = quakes['features'].sort((a, b) => {
                    return b['properties']['mag'] - a['properties']['mag'];
                });
                
                const filteredQuakes = sortedQuakes.slice(0, quakesNum);
                setQuakes(filteredQuakes);
                
            }

            else if (selectedOption === 'time') {
                const sortedQuakes = quakes['features'].sort((a, b) => {
                    return b['properties']['time'] - a['properties']['time'];
                });
                
                const filteredQuakes = sortedQuakes.slice(0, quakesNum);
                setQuakes(filteredQuakes);
                
            }
        });
    }

    const fetchCoordinates = () => {
        
        const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationVal
        )}&key=${encodeURIComponent(mapsKey)}`;
    
        fetch(endpoint)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location;
              setMylat(lat);
              setMylong(lng);
              setLocationFetched(true);
              fetchQuakes();
              
            } 
            
            else {
              console.error('No results found');
            }
            
          })
          .catch(error => {
            console.error(error);
          });
      };

    // 1. fetch quakes -> unsorted quakes
    // 2. depending on option, sort quakes
    // 3. limit number of quakes
    // 4. display on map 

    useEffect(() => {

        if (selectedOption === 'magnitude'){
            //mylat = 16.33255;
            //mylong = -168.03100;

            // pacific center
            setMylat(16.33255);
            setMylong(-168.03100);
            setLocationFetched(true);
            fetchQuakes();
        }
        else if (selectedOption === 'time') {
            //mylat = 37.0902;
            //mylong = -95.7129;

            // US center
            setMylat(37.0902);
            setMylong(-95.7129);
            setLocationFetched(true);
            fetchQuakes();
        }
        else {

            // user defined center
            // if not given, default to center of US

            if (locationVal == '') {
                setMylat(37.0902);
                setMylong(-95.7129);
                setLocationFetched(true);
                fetchQuakes();
            }
            else {
                fetchCoordinates();
            }
        }

        
    }, [])



    const MapComponent = ({ quakes }) => {
        const mapContainerStyle = {
          width: '100%',
          height: '100%' // Adjust the height as needed
        };

        const renderMarkers = (map, maps) => {
            const infowindows = [];
          
            quakes.forEach((quake) => {
              const marker = new maps.Marker({
                position: {
                  lat: quake.geometry.coordinates[1],
                  lng: quake.geometry.coordinates[0],
                },
                map,
              });
          
              const infowindow = new maps.InfoWindow({
                content: 
                    `<div style="text-align: center;">
                        <div>
                            ${quake.properties.title}
                        </div>
                        <a href="${quake.properties.url}" target="_blank" rel="noopener noreferrer">
                            <u>    
                                details
                            </u>
                        </a>
                    
                    
                    </div>`,
              });
          
              marker.addListener("click", () => {
                infowindows.forEach((window) => window.close());
                infowindow.open(map, marker);
              });
          
              infowindows.push(infowindow);
            });




            if (selectedOption == 'proximity') {

                const marker = new maps.Marker({
                    position: {
                    lat: mylat,
                    lng: mylong,
                    },
                    map,
                });
            
                const infowindow = new maps.InfoWindow({
                    content: 
                        `<div style="text-align: center;">
                            <div>
                                ${'You'}
                            </div>
                        
                        </div>`,
                });

                infowindow.open(map, marker);
            
                marker.addListener("click", () => {
                    infowindows.forEach((window) => window.close());
                    infowindow.open(map, marker);
                });
            
                infowindows.push(infowindow);
            }

          };
      
        return (
            <div style={mapContainerStyle}>
                {quakes?.length > 0 && 
                <GoogleMapReact
                    bootstrapURLKeys={{ key: mapsKey }}
                    defaultCenter={{ lat: mylat, lng: mylong }}
                    defaultZoom={3}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                >
                </GoogleMapReact>
                }
           </div>
        );
      };

    return (


        <div className="relative h-screen bg-gray-200 ">

        <Button 
            className="absolute top-0 left-0 mt-4 ml-4 p-2 bg-blue-500 text-white rounded"
            onClick={routeChange}
            variant="contained"
            style={{marginLeft: '10%', marginTop: '30px'}}
            >
            <KeyboardArrowLeftIcon />
            Back
        </Button>

        <div className="border-2 border-blue-500 mx-auto my-10 w-4/5 h-4/5">
        { quakes?.length > 0 && locationFetched === true && mylat !== null && mylong !== null &&
            <MapComponent quakes={quakes} />
        } 
        </div>
        
        </div>
    );
    };

export default Map;
