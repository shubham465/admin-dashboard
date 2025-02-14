import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

export default function SelectBasic({status, updateRows, rows, index}) {
  const [value, setValue] = React.useState(status)
  const handleChange = (event, newValue) => {
   setValue(newValue)
   let newRows = rows.map((item, ind) => ind === index ? {...item, status: newValue} : item  )
   updateRows(newRows)
  };

  return (
    <Select defaultValue={status} value={value}  onChange={handleChange}>
      <Option value="Pending">Pending</Option>
      <Option value="In progress">In progress</Option>
      <Option value="Completed">Completed</Option>
    </Select>
  );
}
