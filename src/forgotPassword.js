import {useState} from "react";
import {TextField,Grid,Box,Typography} from "@mui/material"
import axios from "axios"
import {Url} from "./backend"
import login from "./asset/login.jpg"

function Forgot() {
    const[email,setMail]=useState("")
    const [message,setMessage]=useState("")

const handleChange=({target:{name,value}})=>{
    setMail(value)


}

   const handleSubmit=async(e)=>{
       e.preventDefault()
       const data=await axios.post(`${Url.backendUrl}/users/forget_password`,{email})
       setMessage(data.message)

   }
    return (
        <Grid sx={{ overflow: "hidden", }}>
            <form onSubmit={handleSubmit} >
                <Grid sx={{ margin: "5%", position: "absolute", backgroundColor: "white", width: 300, borderRadius: 5, padding: 2, }} item>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>Forget password</Typography>
                    <TextField size="small" sx={{ margin: 2 }} variant="outlined" label="Email" type="string" name="email" value={email} onChange={handleChange} ></TextField>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>{message}</Typography>
                    
                    <Box sx={{ display: "flex", justifyContent: "center", }}>

                        <button>submit</button>

                    </Box>

                </Grid>
            </form>
            <img style={{ height: 600, width: "100%" }} alt="login" src={login} />
        </Grid>
    )
}
export default Forgot