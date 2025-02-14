import * as React from 'react';
import Input from '@mui/joy/Input';

export default function BasicInput({ name, updateRows, rows, index }) {
  const [value, setValue] = React.useState(name);
  const inputRef = React.useRef(null); // Reference to the input element

  // Handle submit when pressing Enter or clicking away
  const handleSubmit = (e) => {
    e.preventDefault();
    let newRows = rows.map((item, ind) => ind === index && value!='' ? {...item, name: value} : item  )
    updateRows(newRows)
  };



  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={handleSubmit}
        placeholder="Type project name..."
        ref={inputRef} // Attach the ref to the input
      />
    </form>
  );
}
