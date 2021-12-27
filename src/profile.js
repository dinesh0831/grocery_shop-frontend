import { useCallback, useEffect, useState } from 'react'
import { Box, Typography, Card, CardMedia, CardContent, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, } from "@mui/material"
import { AccordionSummary, Accordion, AccordionDetails } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios"
import Menubar from "./menuBar"
import { useNavigate } from 'react-router';
import jwt from "jsonwebtoken";
import { Url } from "./backend"
function Profile() {
    const [orders, setOrders] = useState([])
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const getOrder = useCallback( async () => {
        const token = localStorage.getItem("clone")
        if (token) {
            const decoded = jwt.decode(token)
            console.log(decoded)
            if (Date.now() < decoded.exp * 1000) {
                const { data } = await axios.get(`${Url.backendUrl}/order/getOrder`, {
                    headers: { clone: token }
                })
                console.log(data)
                setOrders(data)
                setData(decoded.user)
            }
        }
        else {
            navigate("/login")
        }

    },[navigate])
    useEffect(() => {
        getOrder()
    },[getOrder])
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Menubar />
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10,width:"100%" }}>
                <Box sx={{ display: "flex", justifyContent: "center", }}>
                    <Card sx={{ width: 250, height: "max-content" }}>

                        <CardMedia sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 100 }} alt="green iguana">
                            <AccountCircleIcon sx={{ fontSize: 64 }} />
                        </CardMedia>

                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {data.name}
                            </Typography><br />
                            <Typography variant="body2" color="text.primary">{data.email}</Typography>
                            <Typography variant="body2" color="text.primary">{data.mobileno}</Typography>


                        </CardContent>

                    </Card>
                </Box>
                <Box sx={{ marginLeft: 3, }}>

                    <Box>
                        <Typography gutterBottom variant="h5" component="div">Ordered List </Typography>
                        {orders.map((item) => {
                            return (
                                <Accordion key={item._id} expanded={expanded === item._id} onChange={handleChange(item._id)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                        
                                    >
                                        <Typography sx={{ width: '50%', flexShrink: 0 }}>
                                            Order Id:{item._id}
                                        </Typography>
                                        <Typography sx={{ marginRight:2}}>
                                        Ordered Name:{item.name}
                                        </Typography>
                                        <Typography sx={{  }}>
                                        Mobile No:{item.contact}
                                        </Typography>
                                       
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Product Name</TableCell>
                                                        <TableCell align="center">Quantity</TableCell>
                                                        <TableCell align="center">Variant</TableCell>
                                                        <TableCell align="center">price</TableCell>
                                                        
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.order.map((row,index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell align="center">{row.quantity}</TableCell>
                                                            <TableCell align="center">{row.weight}{row.variant}</TableCell>
                                                            <TableCell align="center">{row.price}</TableCell>

                                                            
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box sx={{margin:2,width:"30%"}}><Typography>Delivery Address:</Typography>
                                        <Typography sx={{textAlign:"start"}}>{item.address.houseNo_street}, {item.address.village}, {item.address.city}, pin:{item.address.pin}</Typography>
                                        <Typography>Contact No: {item.contact}</Typography>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}

                    </Box>

                </Box>
            </Box>
        </>
    )

}
export default Profile