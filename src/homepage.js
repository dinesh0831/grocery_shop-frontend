
import { Grid, Box, Typography, IconButton, Button, Card, CardMedia, CardContent, CardActions,  } from "@mui/material"

import axios from "axios"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react"
import {Url } from "./backend"
import jwt from "jsonwebtoken"
import { useNavigate } from "react-router-dom";
import Menubar  from "./menuBar";

function Home(props) {

  const [product, setProduct] = useState([])

 
  const [Cart, setCart] = useState(0)
  const navigate=useNavigate()
  const getProduct = async () => {
    
    const { data } = await axios.get(`${Url.backendUrl}/product`,)
    console.log(data)
    setProduct(data)


  }

  const addToCart = async (name, quantity, price, weight, variant) => {

    const cart = {
      name: name, quantity: quantity, price: price, weight: weight, variant: variant
    }

    setCart(Cart + 1)
    const token = localStorage.getItem("clone");
    if(token){
    const decoded = jwt.decode(token)
    
    if (Date.now() < decoded.exp * 1000) {
      console.log(decoded.user._id)
      const { data } = await axios.patch(`${Url.backendUrl}/cart/${decoded.user._id}`, {
        cart
      },{headers:{ clone:token}})
      console.log(data)
    }}
    else{
      navigate("/login")
    }
  }
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
  }, [])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Menubar/>
      <Grid container spacing={2} sx={{ display:"flex",justifyContent:"center" }}>
        {product.map(items => {

          return (
            <Grid key={items._id}  item>
              <Card sx={{ width: 250,height:350,position :"relative"}}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${Url.backendUrl}/${items.photos.filename}`}
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
