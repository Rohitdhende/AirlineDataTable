
import * as React from 'react';

import "./UserTable.scss";
import {
    Modal,
    Button,
    Typography
} from '@mui/material';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import {
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture } from "@fortawesome/free-solid-svg-icons"

export default function UserTable() {
    //------------------------------------------------------------
    // State Definitions
    //------------------------------------------------------------
    const [passengersData, setData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [selectedUser, setUser] = React.useState()
    const [totalPassengers, setTotalPassengers] = React.useState(0);

    //------------------------------------------------------------
    // Column Definitions
    //------------------------------------------------------------
    const columns = [
        { id: 'name', label: 'User Name', minWidth: 80, align: 'center' },
        { id: 'trips', label: 'Total Number of Trip', minWidth: 80, align: 'center' },
        {
            id: 'airlines',
            label: '',
            minWidth: 80,
            align: 'center',
            renderCell: (airlinedata, idx) => {
                return <div>
                    <Button color="success" sx={{ color: '#fff' }} variant="outlined" key={idx} onClick={() => handleOpen(airlinedata)}>Check &nbsp; <FontAwesomeIcon icon={faPlaneDeparture} /> &nbsp; Airline</Button>
                </div>;
            },
        }
    ];

    //------------------------------------------------------------
    // Handle Change Page
    //------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    //------------------------------------------------------------
    // Handle Change Page
    //------------------------------------------------------------
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 300,
        padding: 5,
        borderRadius: "5%"
    };

    //------------------------------------------------------------
    // Fetch Data from API
    //------------------------------------------------------------
    React.useEffect(() => {
        const url = `https://api.instantwebtools.net/v1/passenger?page=${page}&size=${rowsPerPage}`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                setData(json.data);
                setTotalPassengers(json.totalPassengers);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, [page, rowsPerPage]);

    //------------------------------------------------------------
    // Modal Logic
    //------------------------------------------------------------
    const [open, setOpen] = React.useState(false);
    const handleOpen = (selectedData) => {
        setOpen(true);
        setUser(selectedData);
    };
    const handleClose = () => setOpen(false);

    return (
        <div className={`user-table-parent`}>
            <Paper sx={{ backgroundColor: '#121212', color: '#fff', width: '100%', height: '100vh', overflow: 'hidden' }} className={`user-table-container`}>
                <TableContainer sx={{ color: '#fff', maxHeight: '90vh' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ backgroundColor: '#121212', color: '#fff', maxWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {passengersData
                                .map((row, idx) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                            {columns.map((column) => {
                                                let value = row[column.id];
                                                return (
                                                    <TableCell sx={{ color: '#fff' }} key={column.id} align={column.align}>
                                                        {column.id === "airlines" ? column.renderCell(row.airline, idx) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    sx={{ color: '#fff' }}
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={totalPassengers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    {selectedUser?.map((data, idx) => {
                        return (
                            <Card sx={style} key={idx}>
                                <CardMedia
                                    sx={{ color: '#fff' }}
                                    component="img"
                                    height="auto"
                                    image={data?.logo}
                                    alt="green iguana"
                                />

                                <CardContent>
                                    <Typography gutterBottom component="div">
                                        Name: {data?.name}
                                        <Typography gutterBottom component="div">
                                            Country: {data?.country}
                                        </Typography>
                                        <Typography gutterBottom component="div">
                                            Slogan: {data?.slogan}
                                        </Typography>
                                        <Typography gutterBottom component="div">
                                            Head Quaters: {data?.head_quaters}
                                        </Typography>
                                        <Typography gutterBottom component="div">
                                            Established: {data?.established}
                                        </Typography>
                                        <Typography gutterBottom component="div">
                                            website:<a href={data?.website} rel="noreferrer" target="_blank"> {data?.website}</a>
                                        </Typography>
                                    </Typography>
                                </CardContent>
                                <div className="close-button-container">
                                    <Button color="warning" variant="outlined" onClick={handleClose}>Close</Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </Modal>
        </div>
    );
}