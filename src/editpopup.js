import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { useScrollTrigger } from "@mui/material";
import { React, useEffect } from "react";
import "./App.css";
import styled from "@emotion/styled";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import "dayjs/locale/fr";
import "dayjs/locale/de";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { TextField, Button, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { editleave, getleaves } from "./actions/leaveActions";
import { getElRoot } from "fullcalendar";
// or

export const Popup = ({
  editpopupOpen,
  setEditpopupOpen,
  editItem,
  setNotification,
}) => {
  console.log(editpopupOpen, editItem, setEditpopupOpen, "edititem");
  const dispatch = useDispatch();
  const [dateofbirth, setDateOfBirth] = useState(dayjs());
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState("");
  useEffect(() => {
    if (editItem) {
      setName(editItem?.name);
      setCountry(editItem?.country);
      setDateOfBirth(editItem?.dateofbirth);
    }
  }, [editItem]);
  const handlechange = (e) => {
    setName(e.target.value);
  };
  const handleClose = () => {
    setEditpopupOpen(!editpopupOpen);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const myform = {
      name: name,
      id: editItem.id,
      resume: editItem.resume,
      country: editItem.country,
      dateofbirth: editItem.dateofbirth,
    };
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
          "https://vouch-digital-backend.herokuapp.com/client/upload",
          data
        );
      } catch (err) {}
    }
    dispatch(editleave(myform));
    dispatch(getleaves());
    setNotification({ open: true, message: "edited successfully" });
    setEditpopupOpen(false);
  };
  return (
    <>
      <div className="popup">
        <Dialog onClose={handleClose} open={editpopupOpen}>
          <div className="popp">
            <div className="popup_left">
              <div></div>
            </div>
            <div className="popup_right">
              <h2>edit image</h2>
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
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </Grid>
                  <Grid item lg={12}>
                    <TextField
                      placeholder="name"
                      sx={{ width: "100%" }}
                      value={name}
                      onChange={handlechange}
                    />
                  </Grid>

                  <Grid item lg={12}>
                    <TextField
                      placeholder="country"
                      sx={{ width: "100%" }}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
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
                </Grid>
              </form>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Popup;
