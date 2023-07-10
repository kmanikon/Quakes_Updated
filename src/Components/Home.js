import React, { useState } from 'react';
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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";



const Home = () => {

  const [selectedOption, setSelectedOption] = useState('proximity');
  const [quakesNum, setQuakesNum] = useState(10);
  const [location, setLocation] = useState('');


  const [showAbout, setShowAbout] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const changeValue = (event, value) => {
    setQuakesNum(value);
  };

  const getText = (value) => `${value}`;

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };


  let navigate = useNavigate(); 

  const routeChange = () =>{ 
    //hangeCount++;
    let path = `/map`; 
    navigate(path, {state:{selectedOption: selectedOption, quakesNum: quakesNum, locationVal: location}});
}

  const handleSubmit = () => {
    routeChange();
  }

  return (
    <div className="bg-gray-200 h-screen flex items-center justify-center">

      
      <div className="form-container absolute" style={{top: '20%'}}>
        <div className="border-2 border-gray-400 bg-[#c7d8f3] p-8 rounded-lg w-96 ">
          <p className="text-[#00539C] py-4 max-w-[700px] text-xl font-bold">
            Search Quakes
          </p>
          <div className="flex items-center mb-4">
            {selectedOption === 'proximity' ? (
              <TextField
                type="text"
                placeholder="Enter a location"
                variant="outlined"
                size="small"
                className="rounded-lg flex-grow"
                style={{ marginRight: '8px' }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <TextField
                type="text"
                placeholder="Enter a location"
                variant="outlined"
                size="small"
                className="rounded-lg flex-grow"
                style={{ marginRight: '8px' }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled
              />
            )}

            <FormControl fullWidth style={{ width: '140px' }}>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                label="Sort By"
                onChange={handleOptionChange}
                style={{ height: '40px' }}
              >
                <MenuItem value="magnitude">Magnitude</MenuItem>
                <MenuItem value="time">Time</MenuItem>
                <MenuItem value="proximity">Proximity</MenuItem>
              </Select>
            </FormControl>
          </div>


          <Box mt={2}>
            <Typography gutterBottom className="text-[#00539C] text-xl font-bold">
              Quakes to Display
            </Typography>
            <Slider
              min={5}
              max={50}
              step={5}
              value={quakesNum}
              marks
              onChange={changeValue}
              valueLabelDisplay="auto"
              getAriaValueText={getText}
              aria-label="custom thumb label"
            />
          </Box>

          <div className="flex justify-between mt-4">
            <div className="flex justify-start">
              <Button
                variant="outlined"
                color="primary"
                onClick={toggleAbout}
                className="text-white"
              >
                {showAbout ? 'Hide About' : 'Show About'}
              </Button>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="contained"
                color="primary"
                className="flex items-center justify-center"
                onClick={handleSubmit}
              >
                Go
                <KeyboardArrowRightIcon />
              </Button>
            </div>
          </div>
        </div>

         
      </div>
      
      {showAbout && (
          <div className="border-2 border-gray-400 bg-[#c7d8f3] p-8 rounded-lg w-96 absolute" style={{bottom:'8%'}}>
            This is an online tool for visualizing earthquake data collected by the US Geological Survey over the last 30 days.
            Use the dropdown to choose an attribute to sort by and move the slider to adjust the number of quakes to display.
          </div>
        )}
    </div>
  );
};

export default Home;
