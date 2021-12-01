import { Grid, Box, Typography } from "@mui/material";
import { useState, useEffect,} from "react";
import Otp from "./asset/otp.jpg"
import { useParams ,useNavigate  } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios"
import {Url} from "./backend"
function AccountActivation() {

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
    }, [])
    const navigate=useNavigate()
    const handleSubmit =async () => {
        const token = jwt.decode(params.token)
        console.log(token)
        if (Date.now() < token.exp * 1000) {
            const { name, mobileno, email, password, address } = otp
            const response = await axios.post(`${Url.backendUrl}/users/register`, {
                name, mobileno, email, password, address
            })
            console.log(response)

            navigate("/login")
            
        }
        else{
        alert("your activation failed")
        }
    }

    return (
        <Grid sx={{}}>

            <Grid sx={{ margin: "5%", position: "absolute", backgroundColor: "white", width: 500, borderRadius: 5, padding: 2, }} item>
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>Click Here to Verify</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>name:{otp.name}</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>email:{otp.email}</Typography>




                <Box sx={{ display: "flex", justifyContent: "center", right: 10 }}>
                    <button onClick={handleSubmit} >Verify</button>
                </Box>

            </Grid>

            <img style={{ height: 600, width: "100%" }} alt="login" src={Otp} />
        </Grid>
    )


}
export default AccountActivation