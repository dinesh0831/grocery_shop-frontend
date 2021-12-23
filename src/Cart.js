import axios from "axios";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken"
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper,Button } from "@mui/material"
import {Url } from "./backend"

import Menubar from "./menuBar"
import {  useNavigate } from "react-router";

function Cart(){
    const [cart,setCart]=useState([])
    const  [price,setPrice]=useState([0])
    const navigate=useNavigate()
  const token=localStorage.getItem("clone")
   const getItem=async()=>{
       const decoded=jwt.decode(token)
       if (Date.now() < decoded.exp * 1000)
       {

       const {data}=await axios.get(`${Url.backendUrl}/cart/${decoded.user._id}`,{headers:{ clone:token}})
       console.log(data)
       setCart(data.cart)
       let prices=[...price]
       prices=data.cart.map(item=>item.price)
        setPrice(prices)
        
   }
   else{
       navigate("/login")
   }

}
const removeCart=async(index)=>{
    
    const decoded=jwt.decode(token)
    if(Date.now() < decoded.exp * 1000){
        let carts=[...cart]
    carts.splice(index,1)
    setCart(carts)
     await axios.patch(`${Url.backendUrl}/cart/edit/${decoded.user._id}`,{
        cart:carts
    },{headers:{ clone:token}})
    
    }
    else{
        navigate.push("/login")
    }
   

}
const orderNow=async()=>{
    alert("Your Order placed now...!Please check your profile")
    const decoded=jwt.decode(token)
    console.log(decoded)
    if(Date.now() < decoded.exp * 1000){
       const {data}=await axios.post(`${Url.backendUrl}/order/`,{
           contact:decoded.user.mobileno,
           email:decoded.user.email,
           name:decoded.user.name,
           address:decoded.user.address,
           user:decoded.user._id,
           order:cart
       },{headers:{ clone:token}})
       console.log(data)
       setCart([])
       setPrice([0])
    }
    else{
        navigate.push("/login")
    }

}
 
   useEffect(()=>{
       getItem()
   },[cart,price])

return(
    <>
    <Menubar/>
    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
             
                <TableHead>
                    <TableRow>
                    <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>List.No</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>Name</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>Quantity</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>Variant</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>Price</TableCell>
                     
                        <TableCell align="center">Remove</TableCell>
                        
                      
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cart.map((row,index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{index+1}</TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.quantity}</TableCell>
                           < TableCell align="center">{row.weight}{row.variant}</TableCell>
                            <TableCell align="center">{row.price}</TableCell>
                          
                            <TableCell align="center"><Button onClick={()=>removeCart(index)}>Remove  </Button></TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{bgcolor:"gainsboro"}}>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Total Quantity</TableCell>
                      
                        <TableCell align="center">{cart.length}</TableCell>
                        
                        <TableCell align="center">Total Price</TableCell>
                        <TableCell align="center">{price.reduce((a,b)=>a+b,0)}</TableCell>

                        <TableCell align="center"><Button sx={{color:"black",}} variant="outlined" color="success" onClick={orderNow}>Order Now  </Button></TableCell>                        
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </>
)
}
export default Cart
