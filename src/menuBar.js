
import { useEffect, useState, } from "react";
import { IconButton, Button, Badge, Typography, } from "@mui/material"
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import axios from "axios"
import {Url } from "./backend"
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { Link,useNavigate } from "react-router-dom"

import jwt from "jsonwebtoken"
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PostAddIcon from '@mui/icons-material/PostAdd';

function Menubar() {

    const [state, setState] = useState({

        left: false,

    });
    const [users,setUsers]=useState({});
    const [user,setUser]=useState({})
    const [cart,setCart]=useState(0)
const navigate=useNavigate()
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
        })
    
   



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
    return (
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

    )
}
export default Menubar