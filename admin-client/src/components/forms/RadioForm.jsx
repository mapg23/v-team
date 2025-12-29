/**
 * Build dynamic radio forms from data
 * Call provided method on selected radio
 */
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function RadioForm({ data, action, type }) {
  const [value, setValue] = useState("");
  const _data = Array.isArray(data) ? data : [data];
  if (_data.length === 0) return <p>Saknar data...</p>;

  async function handleAction(e) {
    e.preventDefault();
    action(value);
  }
  return (
    <>
      <FormControl component="form" onSubmit={handleAction}>
        {/* <FormLabel id="group-label">{title}</FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {data.map((obj) => (
            <FormControlLabel
              key={obj.name ? obj.name : obj.id}
              value={obj.name ? obj.name : obj.id}
              control={<Radio />}
              label={obj.name ? obj.name : `Parkering: ${obj.id}`}
              onChange={(e) => setValue(e.target.value)}
            />
          ))}
        </RadioGroup>
        <Button variant="contained" type="submit">
          Flytta till {type}
        </Button>
      </FormControl>
    </>
  );
}