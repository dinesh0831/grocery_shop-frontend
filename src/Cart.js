import axios from "axios";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken"
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper,Button } from "@mui/material"
import {Url } from "./backend"

import Menubar from "./menuBar"
import {  useNavigate } from "react-router";
const loadScript=(src)=>{
    return new Promise(resolve=>{
        const script=document.createElement("script")
        script.src=src
        
        script.onload=()=>{resolve(true)
        }
        script.onerror=()=>{
            resolve(false)
        }
        document.body.appendChild(script)
    })

    }


function Cart(){
    const [cart,setCart]=useState([])
    const  [price,setPrice]=useState([0])
    const navigate=useNavigate()
  const token=localStorage.getItem("clone")


  const displayRazorpay=async()=>{
    const decoded=jwt.decode(token)
    console.log(decoded)
    const res= await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if (!res){
        alert("Razorpay SDK failed to load")
        return
    }
   
    const {data}=await axios.post(`${Url.backendUrl}/order/razorPay`,{amount:price.reduce((a,b)=>a+b,0)
    },{headers:{clone:token}})

    var options = {
        key: "rzp_test_CJysw9ND9WCm9G", // Enter the Key ID generated from the Dashboard
        amount: data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: data.currency,
        name: "Grocery Shop",
        description: "Thank for purchase! Come Again",
        image: "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg",
        order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
            orderNow()
        },
        prefill: {
            name: decoded.user.name,
            email: decoded.user.email,
            contact: decoded.user.mobileno
        },
        
    };
    
    var paymentObject = new window.Razorpay(options);

    paymentObject.open();
    
  }
   const getItem=async()=>{
       const decoded=jwt.decode(token)
       if (Date.now() < decoded.exp * 1000)
       {

       const {data}=await axios.get(`${Url.backendUrl}/cart/${decoded.user._id}`,{headers:{clone:token}})
       
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
    },{headers:{clone:token}})
    
    }
    else{
        navigate.push("/login")
    }
   

}


const orderNow=async()=>{
   
    const decoded=jwt.decode(token)
    console.log(decoded)
    if(Date.now() < decoded.exp * 1000){
       const {data}=await axios.post(`${Url.backendUrl}/order/`,{
           contact:decoded.user.mobileno,
           email:decoded.user.email,
           name:decoded.user.name,
           address:decoded.user.address,
           user:decoded.user._id,
           order:cart,
           amount:price.reduce((a,b)=>a+b,0)
       },{headers:{clone:token}})
       console.log(data)
      
       setCart([])
       setPrice([0])
       alert("your order successfully done")
    }
    else{
        navigate.push("/login")
    }

}
 
   useEffect(()=>{
       getItem()
   })

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
                     
                        <TableCell align="center" sx={{fontWeight:"bold",fontSize:20}}>Remove</TableCell>
                        
                      
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
                        
                        
                        <TableCell align="center"><Button sx={{color:"black",}}  disabled={cart.length===0} variant="outlined" color="success" onClick={displayRazorpay}>Order Now  </Button></TableCell>                        
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </>
)
}
export default Cart
