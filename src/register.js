import React from "react";
import register from "./asset/otp.jpg"
import { TextField, Grid, Box, Typography } from "@mui/material";
import axios from "axios"
import { Link } from "react-router-dom"
import { Url } from "./backend"
class Register extends React.Component {
    constructor() {
        super()
        this.state = {
            message: "",
            name: "",
            mobileno: "",
            email: "",
            password: "",

            houseNo_street: "",
            village: "",
            city: "",
            pin: "",



        }
    }
    RegisterUsers = async () => {
        const { name, mobileno, email, password, houseNo_street, village, city, pin } = this.state
        const { data } = await axios.post(`${Url.backendUrl}/users/register`, {
            name, mobileno, email, password, address: {
                houseNo_street, village, city, pin
            }
        })

        this.setState({ message: data.message })
        if (data.message === "*User successfully Registered") {
            window.location.href = "/login"
        }

    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.RegisterUsers()
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value })
        console.log(value)

    }


    render() {
        return (

            <Box sx={{  display: "flex", justifyContent: "center", alignItems: "center"}}>
                 <Grid sx={{ position: "absolute", backgroundColor: "white", borderRadius: 5, padding: 2,width:"auto",maxWidth:550 }}>
                <form onSubmit={this.handleSubmit} style={{}}>
                   
                        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>Register</Typography>
                        <Box sx={{   justifyContent: "center", alignItems: "center"}}>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Name" type="string" name="name" value={this.state.name} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="email" type="string" name="email" value={this.state.email} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Mobile No" type="string" name="mobileno" value={this.state.mobileno} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Password" type="password" name="password" value={this.state.password} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="House No & Street" type="string" name="houseNo_street" value={this.state.houseNo_street} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="village/Town" type="string" name="village" value={this.state.village} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="City" type="string" name="city" value={this.state.city} onChange={this.handleChange} ></TextField>
                        <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Pin" type="string" name="pin" value={this.state.pin} onChange={this.handleChange} ></TextField>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", right: 10 }}>
                            <Typography sx={{ color: "red" }}>{this.state.message}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center", right: 10 }}>
                            <button>submit</button>
                        </Box>
                        <Box><Typography sx={{ textAlign: "center" }}>If you  have account
                            <Link style={{ margin: 5 }} to="/login">click here</Link>to register</Typography>
                        </Box>
                    

                </form>
                </Grid>
                <img style={{height:"100vh",width:"100%",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundAttachment:"fixed", }} alt="register" src={register} />
            </Box >


        )
    }
}
export default Register