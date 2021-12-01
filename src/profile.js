import {useEffect,useState } from 'react'
import { Box, Typography, Card, CardMedia, CardContent,Paper,Table, TableBody, TableContainer, TableHead, TableRow,TableCell} from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios"
import Menubar from "./menuBar"
import { useNavigate } from 'react-router';
import jwt from "jsonwebtoken";
import {Url} from "./backend"
function Profile() {
    const [orders,setOrders]=useState([])
    const [data,setData]=useState({})
    const navigate=useNavigate()
    const getOrder=async()=>{
        const token=localStorage.getItem("clone")
if(token){
        const decoded = jwt.decode(token)
    console.log(decoded)
    if (Date.now() < decoded.exp * 1000) {
        const {data}=await axios.get(`${Url.backendUrl}/order/getOrder`,{
            headers:{clone:token}
        })
        console.log(data)
        setOrders(data.order)
        setData(data)
    }}
    else{
        navigate("/login")
            }
    
    }
    useEffect(()=>{
        getOrder()
    },[])

return(
    <>
    <Menubar/>
    <Box sx={{ display: "flex", }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Card sx={{ width: 250, height: "max-content" }}>

                <CardMedia sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 100 }} alt="green iguana">
                    <AccountCircleIcon sx={{ fontSize: 64 }} />
                </CardMedia>

                <CardContent sx={{ display: "block",  }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{data.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{data.contact}</Typography>


                </CardContent>

            </Card>
        </Box>
        <Box sx={{ marginLeft: 3, }}>
            
            <Box>
                <Typography gutterBottom variant="h5" component="div">Ordered List </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>

                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Variant</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>

                        {orders.map((item,index)=>{
                            return(
                                <TableRow key={index}
                                        
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="center">
                                  {item.name}
                                </TableCell>


                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="center">{item.weight}{item.variant}</TableCell>

                            </TableRow>

                            )
                        })}
                                   
                           
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box>
    </Box>
    </>
)

}
export default Profile