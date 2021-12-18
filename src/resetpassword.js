import { Grid, TextField, Box, Typography } from "@mui/material";
import { useState, useEffect,} from "react";

import { useParams ,useNavigate  } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios"
import login from "./asset/login.jpg"
import {Url} from "./backend"
function Reset() {
    const[password,setpassword]=useState("")

const handleChange=({target:{name,value}})=>{
    setpassword(value)
}

    const [otp, setOtp] = useState({})

    const params = useParams()
    console.log(params)

    const getData = async () => {
        const token = jwt.decode(params.token)
        
        if (Date.now() < token.exp * 1000) {
            setOtp(token)
            console.log(token)

            
        }

    }
    useEffect(() => {
        getData()
    },)
let navigate=useNavigate ()
    const handleSubmit=async(e)=>{
       e.preventDefault()
        const {email}=otp
        const {data}=await axios.patch(`${Url.backendUrl}/users/reset`,{
            email,password
        })
        console.log(data)
        if(data.messsage==="successfully password changed"){
            navigate("/login")
        }

    }
    return (
        <Grid sx={{  display: "flex", justifyContent: "center", alignItems: "center"  }}>
         <Grid sx={{position: "absolute", backgroundColor: "white", borderRadius: 5, padding: 2,width:"auto" ,maxWidth:300 }} item>
            <form onSubmit={handleSubmit} >
                <Grid sx={{ margin: "5%", position: "absolute", backgroundColor: "white", width: 500, borderRadius: 5, padding: 2, }} item>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>Reset password</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>Email:{otp.email}</Typography>
                    <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Password" type="string" name="email" value={password} onChange={handleChange} ></TextField>
         
                    
                    <Box sx={{ display: "flex", justifyContent: "center", }}>

                        <button>submit</button>

                    </Box>

                
            </form>
</Grid>
            <img style={{ height: "auto", width: "100%" }} alt={"reset"} src={login} />
        </Grid>
    )
}
export default Reset
