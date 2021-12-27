import axios from "axios";
import { useEffect, useState,useCallback } from "react";
import jwt from "jsonwebtoken"
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper,Button } from "@mui/material"
import {Url } from "./backend"

import { IconButton,  Badge, Typography, } from "@mui/material"
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';


import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { Link,useNavigate } from "react-router-dom"


import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';

import PostAddIcon from '@mui/icons-material/PostAdd';



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
  const decoded=jwt.decode(token)
   const getItem=useCallback( async()=>{
       
       if (Date.now() < decoded.exp * 1000)
       {

       const {data}=await axios.get(`${Url.backendUrl}/cart/${decoded.user._id}`,{headers:{clone:token}})
       
       setCart(data.cart)
    
       let prices=data.cart.map(item=>item.price)
        setPrice(prices)
        
   }
   else{
       navigate("/login")
   }

},[decoded.exp,decoded.user._id,token,navigate])
const removeCart=async(index)=>{
    setCartss(cartss-1)
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
const [state, setState] = useState({

    left: false,

});
const [users,setUsers]=useState({});
const [user,setUser]=useState({})
const [cartss,setCartss]=useState(0)

const getUser= async()=>{
    const token=localStorage.getItem("clone")
if(token){
    const decoded=jwt.decode(token)

 if(decoded.exp*1000>Date.now()){
   
     const {data}=await axios.get(`${Url.backendUrl}/cart/${decoded.user._id}`,{headers:{ clone:token}})
     setCartss(data.cart.length)
   
     setUser(decoded.user)
     setUsers(decoded)
 }}
}

const logout=()=>{
    return localStorage.getItem("clone") ? localStorage.removeItem("clone") : navigate("/login")
}

    useEffect(()=>{
        getUser()
    },[])





const toggleDrawer = (anchor, open) => (event) => {
    if (
        event &&
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
    ) {
        return;
    }

    setState({ ...state, [anchor]: open });
};

const list = (anchor) => (
    <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
    >
        <List>

            <ListItem button component={Link} to="/profile" >
                <ListItemIcon>
                   <AccountCircleIcon/>
                </ListItemIcon>
                <ListItemText primary={"Profile"} />
                
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/" >
                <ListItemIcon>
                   <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={"Home"} />
            </ListItem>                               
            <ListItem button component={Link} to="//cart">
                <ListItemIcon>
                   <ShoppingCartSharpIcon/>
                </ListItemIcon>
                <ListItemText primary={"My Cart"} />
            </ListItem>
            {
                user.role==="admin"?<ListItem button component={Link} to="/Add_product" >
                <ListItemIcon>
                   <PostAddIcon/>
                </ListItemIcon>
                <ListItemText primary={"Post Product"} />
            </ListItem>:<></>
            }
            <ListItem button onClick={logout}>
                <ListItemIcon>
                   <LoginIcon/>
                </ListItemIcon>
                <ListItemText primary={users.exp*1000>Date.now()&&localStorage.getItem("clone") ?"logout":"login"} />
            </ListItem>
           
            

        </List>
        

    </Box>
);


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
      setCartss(0)
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
   },[getItem])

return(
    <>
    <div>
            <Box sx={{ bgcolor: "blue", height: 50, display: "flex", alignItems: "center", }}>

                <Button sx={{ margin: 3 }} onClick={toggleDrawer("left", true)}><MenuIcon sx={{ fontSize: 24, color: "white", }} /></Button>
                <SwipeableDrawer
                    anchor={"left"}
                    open={state["left"]}
                    onClose={toggleDrawer("left", false)}
                    onOpen={toggleDrawer("left", true)}
                >
                    {list("left")}
                </SwipeableDrawer>
                <Typography sx={{ color: "white", fontWeight: "bold", fontSize: 24, flexGrow: 1 }} >Grocery Shop</Typography>

                <IconButton component={Link} to="/cart" sx={{ margin: 3 }}><Badge badgeContent={cartss}   color="success" size="small"  ><ShoppingCartSharpIcon sx={{ fontSize: 24, color: "white", }} /></Badge></IconButton>

            </Box>

        </div>
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
