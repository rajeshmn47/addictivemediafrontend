import { React, useEffect, useRef } from "react";
import { useState } from "react";
import "./App.css";
import styled from "@emotion/styled";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import "dayjs/locale/fr";
import "dayjs/locale/de";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { TextField, Button, Grid, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { createleave } from "./actions/leaveActions";
import { createimage } from "./actions/leaveActions";
import axios from "axios";

const locales = ["ko", "fr", "de"];

function AddImage() {
  const { loading, isCreated } = useSelector((state) => state.leave);
  const isMountRef = useRef(false);
  console.log(isCreated, "iscreated");
  const dispatch = useDispatch();
  const [dateofbirth, setDateOfBirth] = useState(dayjs());
  const [name, setName] = useState("");
  const [file, setFile] = useState();
  const [country, setCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (isCreated) {
      setNotification({ open: true, message: "image added successfully" });
      setTimeout(() => {
        setNotification({ open: false, message: "" });
      }, 1000);
    }
  }, [dispatch, isCreated]);

  const handlechange = async (e) => {
    if (e.target.value.length > 0) {
      setCountry(e.target.value);
      console.log(country);
      const { data } = await axios.get(
        `https://addictivebackend.herokuapp.com/api/countries/${e.target.value}`
      );
      console.log(data[0], "daya");
      setSuggestions([...data]);
    } else {
      setSuggestions([]);
      setCountry("");
    }
  };
  const handleSelect = async (a) => {
    setCountry(a);
    setSuggestions([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const myform = { country: country, dateofbirth: dateofbirth, name: name };
    setName("");
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      myform.resume = fileName;
      console.log(myform);
      try {
        await axios.post(
          "https://addictivebackend.herokuapp.com/client/upload",
          data
        );
      } catch (err) {}
      setFile(null);
    }
    dispatch(createimage(myform));
    setFile(null);
  };
  const Dox = styled.div``;

  const Box1 = styled.div`
    width: 500px;
    height: 300px;
    margin: 60px auto;
    padding: 20px;
    background: #f2f2f2;
    border-radius: 10px;
    text-align: center;
  `;

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Add image here</h3>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item lg={12}>
              <h3
                style={{
                  margin: "5px 0",
                  marginRight: "333px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                upload resume here
              </h3>
              <input
                placeholder="image"
                type="file"
                label="image"
                className="imageinput"
                style={{ width: "100%", fontSize: "16px", fontWeight: "600" }}
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Grid>
            <Grid item lg={12}>
              <TextField
                placeholder="name"
                sx={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item lg={12} style={{ position: "relative" }}>
              <TextField
                placeholder="country"
                sx={{ width: "100%" }}
                value={country}
                onChange={handlechange}
              />
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.length > 0 &&
                    suggestions.slice(0, 10).map((s) => (
                      <>
                        <h3
                          className="suggestion"
                          onClick={() => handleSelect(s.name)}
                        >
                          {s.name}
                        </h3>
                      </>
                    ))}
                </div>
              )}
            </Grid>
            <Grid item lg={12}>
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Date of Birth"
                  value={dateofbirth}
                  onChange={(newValue) => {
                    setDateOfBirth(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: "100%" }} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item lg={12}>
              <Button
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  color: "#ffffff",
                }}
                type="submit"
              >
                Submit
              </Button>
            </Grid>

            <Grid item lg={12}>
              {notification.open && (
                <h3 className="createnotification">{notification.message}</h3>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default AddImage;
