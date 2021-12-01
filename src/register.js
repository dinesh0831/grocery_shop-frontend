import React from "react";
import register from "./asset/otp.jpg"
import {TextField,Grid,Box,Typography} from "@mui/material";
import axios from "axios"
import {Link} from "react-router-dom"
import {Url } from "./backend"
class Register extends React.Component{
    constructor(){
        super()
        this.state={
            name:"",
            mobileno:"",
            email:"",
            password:"",
            
                houseNo_street:"",
                village:"",
                city:"",
                pin:""
            

        }
    }
    RegisterUsers=async()=>{
       const {name,mobileno,email,password,houseNo_street,village,city,pin}=this.state
       const response=await axios.post(`${Url.backendUrl}/users/registerVerification`,{
        name,mobileno,email,password,address:{
            houseNo_street,village,city,pin
        }
       })
        console.log(response)

    }

    handleSubmit=(e)=>{
        e.preventDefault()
        this.RegisterUsers()
    }
    
    handleChange=({target:{name,value}})=>{
        this.setState({[name]:value})
        console.log(value)
        
    }


    render(){
        return (
           
            <Grid sx={{overflow:"hidden",}}>
            <form  onSubmit={this.handleSubmit} style={{}}>
                <Grid sx={{margin:"5%",position:"absolute",backgroundColor:"white",width:550,borderRadius:5,padding:2,alignSelf:"center"}}>
                    <Typography sx={{fontSize:24,fontWeight:"bold"}}>Register</Typography>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Name" type="string" name="name" value={this.state.name}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="email" type="string" name="email" value={this.state.email}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Mobile No" type="string" name="mobileno" value={this.state.mobileno}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Password" type="string" name="password" value={this.state.password}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="House No & Street" type="string" name="houseNo_street" value={this.state.houseNo_street}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="village/Town" type="string" name="village" value={this.state.village}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="City" type="string" name="city" value={this.state.city}  onChange={this.handleChange} ></TextField>
                 <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Pin" type="string" name="pin" value={this.state.pin}  onChange={this.handleChange} ></TextField>
                 <Box sx={{display:"flex", justifyContent:"center",right:10}}>
                 <button>submit</button>
                 </Box>
                 <Box>If you  have account
                 <Link style={{margin:5}} to="/login">click here</Link>to register
                 </Box>
                 </Grid>
                 
            </form>
            <img style={{height:600,width:"100%"}} alt="register" src={register}/> 
            </Grid>
             
            
        )
    }
}
export default Register