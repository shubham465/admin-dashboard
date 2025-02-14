import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Input from '@mui/joy/Input';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { ReturnFormattedDate } from './DatePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  alignItems: 'right'
};

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  return `${year}-${month}-${day}`;
}

export default function KeepMountedModal({updateRows, rows}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setDate(dayjs(getFormattedDate()))
    setStatus('Pending')
    setValue('')
  };
  const [value, setValue] = React.useState('');
  const [status, setStatus] = React.useState('Pending')
  const [date, setDate] = React.useState(dayjs(getFormattedDate()))

  return (
    <>
      <Button
            color="primary"
            onClick={handleOpen}
            sx={{
              marginLeft: '100px',
              marginRight: '60px',
              padding: '4px',
              fontSize: '14px',
              background: 'green',
              color: 'white',
            }}
          >
            + Add Project
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        sx={{
          zIndex: 0
        }}
      >
        <Box sx={style}>
                <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="Type project name..."
              />
          <br/>
            <Select  value={status} onChange={(e, newValue)=> {
              setStatus(newValue)
            }}>
              <Option value="Pending">Pending</Option>
              <Option value="In progress">In progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
            <br/>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue)
                  }}
                />
            </LocalizationProvider>
            <br/> <br/>
              <div>
              <Button onClick={handleClose}  color="danger" sx={{marginRight: '55%'}}>
               cancel
            </Button>
              <Button onClick={()=> {
                if(value === '')
                {
                  alert('Add project name')
                  return
                }
                let newDate =  ReturnFormattedDate(date);
                updateRows([...rows, {
                  name: value,
                  status: status,
                  fat: newDate
                }]);
                handleClose()
              } }
              color="success">
               continue
            </Button>
              </div>
           
        </Box>
      </Modal>
    </>
  );
}
