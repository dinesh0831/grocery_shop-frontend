
import { Grid, Box, Typography, IconButton, Button, Card, CardMedia, CardContent, CardActions,  } from "@mui/material"

import axios from "axios"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react"
import {Url } from "./backend"
import jwt from "jsonwebtoken"
import { useNavigate } from "react-router-dom";


import {  Badge, } from "@mui/material"
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';


import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { Link } from "react-router-dom"

import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';

import PostAddIcon from '@mui/icons-material/PostAdd';


 

function Home() {

  const [product, setProduct] = useState([])
  const [state, setState] = useState({

    left: false,

});
const [users,setUsers]=useState({});
const [user,setUser]=useState({})
const [cart,setCart]=useState(0)

 
  
  const navigate=useNavigate()
  const getProduct = async () => {
    
    const { data } = await axios.get(`${Url.backendUrl}/product`,)
    
    setProduct(data)


  }
  const getUser= async()=>{
    const token=localStorage.getItem("clone")
if(token){
    const decoded=jwt.decode(token)

 if(decoded.exp*1000>Date.now()){
   
     const {data}=await axios.get(`${Url.backendUrl}/cart/${decoded.user._id}`,{headers:{ clone:token}})
     setCart(data.cart.length)
   
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


  const addToCart = async (name, quantity, price, weight, variant) => {
    setCart(cart+1)
    const carts = {
      name: name, quantity: quantity, price: price, weight: weight, variant: variant
    }
    const token = localStorage.getItem("clone");
    if(token){
    const decoded = jwt.decode(token)
    
    if (Date.now() < decoded.exp * 1000) {
      
      await axios.patch(`${Url.backendUrl}/cart/${decoded.user._id}`, {
        cart:carts
      },{headers:{ clone:token}})
      
    }}
    else{
      navigate("/login")
    }
  }
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
  const updateQuantity = async (object, condition) => {

    let products = [...product]
    if (condition) {
      const index = products.findIndex(p => p._id === object._id)
      products[index].userQuantity += 1
    }
    else {
      const index = products.findIndex(p => p._id === object._id)
      products[index].userQuantity -= 1
    }
    setProduct(products)
  }

  





  useEffect(() => {
    getProduct()
  },[] )
  return (
    <Box sx={{ flexGrow: 1 }}>
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

                <IconButton component={Link} to="/cart" sx={{ margin: 3 }}><Badge badgeContent={cart}   color="success" size="small"  ><ShoppingCartSharpIcon sx={{ fontSize: 24, color: "white", }} /></Badge></IconButton>

            </Box>

        </div>
      <Grid container spacing={2} sx={{ display:"flex",justifyContent:"center" ,marginTop:5}}>
        {product.map(items => {

          return (
            <Grid key={items._id}  item>
              <Card sx={{ width: 250,height:350,position :"relative"}}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${Url.backendUrl}/photo/${items.photos.filename}`}
                  alt="name of product"
                />
                <CardContent >
                  <Typography gutterBottom variant="h6" component="div">
                    {items.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography >Weight:{items.weight}</Typography>
                    <Typography>{items.variant}</Typography>
                  </Box>


                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography >Quantity:</Typography>
                    <IconButton disabled={items.userQuantity <= 1} onClick={() => updateQuantity(items, false)}><RemoveIcon sx={{ color: "black", border: .1, fontSize: 16 }} /></IconButton>
                    <Typography sx={{ fontSize: 24 }}>{items.userQuantity}</Typography>
                    <IconButton onClick={() => updateQuantity(items, true)}><AddIcon sx={{ color: "black", border: .1, fontSize: 16 }} /></IconButton>
                  </Box>
                  <Typography sx={{ fontWeight: "bold" }}>Price:{items.price * items.userQuantity}</Typography>


                </CardContent>
                
                <CardActions sx={{position:" absolute",bottom:0 }} >

                  <Button size="small" onClick={() => addToCart(items.name, items.userQuantity, items.price*items.userQuantity, items.weight, items.variant)}>Add to Cart</Button>

                </CardActions>
                
              </Card>

            </Grid>
          )
        })}



      </Grid>
    </Box>


  )
}

export default Home;
