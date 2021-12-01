import React from "react"
import { TextField,  Typography, Select, MenuItem, } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios";
import Menubar from "./menuBar"
import jwt from "jsonwebtoken"
import {Url} from "./backend"

class AddProduct extends React.Component {
    constructor() {
        super()
        this.state = {
            name: "",
            variant: "",
            price: "",
            photos:{},
            weight: 0,
            weights: [1, 2, 3, 5, 10, 25, 100, 200, 500],
            variants: ["Kg", "Grms", "L", "ml", "Pkt",],
            total_Quantity: 0,
            file: []

        }

    }
    fileupload = (e) => {
        console.log(e.target.files)
        this.setState({ file: e.target.files })

    }
    handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value })

    }
    handleSubmit = async (e) => {

        e.preventDefault();
        const token = localStorage.getItem("clone");
       
           
        console.log(this.state.file)
        const data = new FormData();

        data.append("file", this.state.file[0])


        const response = await axios.post(`${Url.backendUrl}/products/upload`, data,
        {headers:{ clone:token}})
        console.log(response)
        this.onSuccess(response.data)
        this.postProduct()



    }

    postProduct = async () => {
        const token = localStorage.getItem("clone");
        if(token){
        const decoded = jwt.decode(token)
           const {name,variant,price,weight,photos,total_Quantity}=this.state
           if (Date.now() < decoded.exp * 1000) {
        const response = await axios.post(`${Url.backendUrl}/products`, {
            name,variant,price,weight,photos,total_Quantity
        },{headers:{ clone:token}})
        console.log(response.data)
    }}
    else{
        window.location.href="/login"
    }
    
        }
onSuccess = (file) => {
                this.setState({ photos: file })
                console.log(this.state.photos)
            }

    render() {
            return(
            <Box>
                <Menubar/>
                <Typography sx={{ fontSize: 32, fontWeight: "bold", margin: 3 }}>Add Products:</Typography>
                <Box onSubmit={this.handleSubmit} component="form" sx={{ marginLeft: 20 }}>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Product Name:</Typography>
                    <TextField size="small" sx={{ marginLeft: 20 }} variant="outlined" label="Product Name" name="name" value={this.state.name} onChange={this.handleChange} ></TextField>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Select Variant:</Typography>
                    
                    <Select  size="small" id="demo-simple-select" name="variant" value={this.state.variant} sx={{ marginLeft: 20 }} placeholder="select variant"  onChange={this.handleChange}>
                        {this.state.variants.map((items,index) => <MenuItem key={index} value={items}>{items}</MenuItem>)}
                    </Select>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Select Weight:</Typography>
                    <Select  size="small" id="demo-simple-select" name="weight" value={this.state.weight} sx={{ marginLeft: 20 }} placeholder="select variant" onChange={this.handleChange} >
                        {this.state.weights.map((items ,index)=> <MenuItem key={index} value={items}>{items}</MenuItem>)}
                    </Select>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Product Price:</Typography>
                    <TextField size="small" sx={{ marginLeft: 20 }} variant="outlined" label="Product Price" type="number" name="price" value={this.state.price}  onChange={this.handleChange} ></TextField>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Total Quantity:</Typography>
                    <TextField size="small" sx={{ marginLeft: 20 }} variant="outlined" label="Total Quantity" type="number" name="total_Quantity" value={this.state.total_Quantity}  onChange={this.handleChange} ></TextField>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold", }}>Add Cover Photo:</Typography>
                   
                    < input type="file" placeholder="select" sx={{ border: "none", textDecoration: "none",marginLeft:20 }} onChange={this.fileupload} /><br/><br/>
                    
                   
                   
                    <button >Submit</button>

                </Box>
                
            </Box >
        )
    }
}
export default AddProduct