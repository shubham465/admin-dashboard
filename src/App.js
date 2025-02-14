import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DatePickerValue from './DatePicker';
import SelectBasic from './Select';
import BasicInput from './Input';
import KeepMountedModal from './Modal';
import { Button, Input, SvgIcon } from '@mui/joy';
import { Search, SearchOffOutlined } from '@mui/icons-material';

function createData(name, status, fat) {
  return {
    name,
    status,
    fat
  };
}

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  return `${year}-${month}-${day}`;
}

const initialRows = [
  createData('Cupcake', 'Completed', getFormattedDate()),
  createData('Donut', "In progress", getFormattedDate()),
  createData('Eclair', "In progress", getFormattedDate()),
  createData('Frozen yoghurt', "In progress", getFormattedDate()),
  createData('Gingerbread', "Pending", getFormattedDate()),
  createData('Honeycomb', "Pending", getFormattedDate()),
];


function labelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy); 
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Project Name',
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Due Date',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'select all desserts',
              },
            }}
            sx={{ verticalAlign: 'sub' }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              aria-sort={
                active ? { asc: 'ascending', desc: 'descending' }[order] : undefined
              }
            >
              <Link
                underline="none"
                color="neutral"
                component="button"
                onClick={createSortHandler(headCell.id)}
                startDecorator={
                  headCell.numeric ? (
                    <ArrowDownwardIcon
                      sx={[active ? { opacity: 1 } : { opacity: 0 }]} />
                  ) : null
                }
                endDecorator={
                  !headCell.numeric ? (
                    <ArrowDownwardIcon
                      sx={[active ? { opacity: 1 } : { opacity: 0 }]} />
                  ) : null
                }
                sx={{
                  fontWeight: 'lg',
                  '& svg': {
                    transition: '0.2s',
                    transform:
                      active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },
                  '&:hover': { '& svg': { opacity: 1 } },
                }}
              >
                {headCell.label}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete, handleSearchChange, updateRows, rows } = props;
  const [searchTerm, setSearchTerm] = React.useState('')
  
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          py: 1,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          borderTopLeftRadius: 'var(--unstable_actionRadius)',
          borderTopRightRadius: 'var(--unstable_actionRadius)',
        },
        numSelected > 0 && {
          bgcolor: 'background.level1',
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1' }} component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography
            level="body-lg"
            id="tableTitle"
            component="div"
          >
            Projects
        </Typography>
        )}
     {numSelected === 0 && <KeepMountedModal updateRows={updateRows} rows={rows} /> }
      
      {numSelected===0 && 
      <Input
      color='primary'
      sx={{
        color: 'black'
      }}
      value={searchTerm}
      startDecorator={<Search />}
      endDecorator={<Button>search</Button>}
      onChange={(e) => {
        handleSearchChange(e.target.value);
        setSearchTerm(e.target.value)
      }}
    ></Input>}
       
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            size="sm"
            color="danger"
            variant="solid"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) }
    </Box>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function TableSortAndSelection() {
  const [rows, setRows] = React.useState(() => {
    const storedData = localStorage.getItem("data");
    // Check if data exists and is valid, otherwise set it as an empty array
    return storedData ? JSON.parse(storedData) : initialRows;
  });
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };  

  React.useEffect(()=> {
    localStorage.setItem("data", JSON.stringify(rows));
  },[rows])

  const updateRows = (value) => {
    setRows(value)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // console.log(JSON.parse(localStorage.getItem("data")))
  // console.log("rows", rows)

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10));
    setPage(0);
  };

  const handleDelete = () => {
    const newRows = rows.filter((row) => !selected.includes(row.name));
    setRows(newRows);
    setSelected([]); // Reset selected rows after deletion
  };

  return (
    <Sheet
      variant="outlined"
      sx={{  boxShadow: 'sm', borderRadius: 'sm' }}
    >
      <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDelete} rows={rows} handleSearchChange={handleSearchChange} updateRows={updateRows} />
      <Table
        aria-labelledby="tableTitle"
        hoverRow
        sx={{
          '--TableCell-headBackground': 'transparent',
          '--TableCell-selectedBackground': (theme) =>
            theme.vars.palette.success.softBg,
          '& thead th:nth-child(1)': {
            width: '40px',
          },
          '& thead th:nth-child(2)': {
            width: '30%',
          },
          '& tr > *:nth-child(n+3)': { textAlign: 'right' },
        }}
      >
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={rows.length}
        />
        <tbody>
          {rows.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const isItemSelected = selected.includes(row.name);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <tr
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.name}
                  style={
                    isItemSelected
                      ? {
                        '--TableCell-dataBackground':
                          'var(--TableCell-selectedBackground)',
                        '--TableCell-headBackground':
                          'var(--TableCell-selectedBackground)',
                      }
                      : {}
                  }
                >
                  <th scope="row">
                    <Checkbox
                     onClick={(event) => handleClick(event, row.name)}
                      checked={isItemSelected}
                      slotProps={{
                        input: {
                          'aria-labelledby': labelId,
                        },
                      }}
                      sx={{ verticalAlign: 'top' }}
                    />
                  </th>
                  <th id={labelId} scope="row">
                    <BasicInput name={row.name} rows={rows} index={index} updateRows={updateRows}/>
                  </th>
                  <td><SelectBasic status={row.status} rows={rows} index={index} updateRows={updateRows}/></td>
                  <td><DatePickerValue date={row.fat} rows={rows} index={index} updateRows={updateRows} /></td>
                </tr>
              );
            })}

        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'flex-end',
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: Math.min(rows.length, (page + 1) * rowsPerPage),
                    count: rows.length === -1 ? -1 : rows.length,
                  })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: 'background.surface' }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={rows.length !== -1 && page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    onClick={() => handleChangePage(page + 1)}
                    sx={{ bgcolor: 'background.surface' }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
}
