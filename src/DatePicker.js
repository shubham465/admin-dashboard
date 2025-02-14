import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export function ReturnFormattedDate(date){
  let month = date["$M"]+1
  let day = date["$D"]
  let year = date["$y"]
  let formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

export default function DatePickerValue({date, updateRows, rows, index}) {
  const [value, setValue] = React.useState(dayjs(date));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            let newRows = rows.map((item, ind) => {
             return ind === index ? {...item, fat: ReturnFormattedDate(newValue)} : item 
            } )
            updateRows(newRows)
          }}
        />
    </LocalizationProvider>
  );
}
