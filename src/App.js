
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AddProduct from "./Add_product"
import Home from "./homepage"
import AccountActivation from "./accountActivation"
import Register from "./register";
import Login from "./login"
import Profile from "./profile"
import Cart from "./Cart";
import Menubar from "./menuBar"
import Forget from "./forgotPassword"
import Reset from "./resetpassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Add_product" element={<AddProduct/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/email_verification/:token" element={<AccountActivation/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/menubar" element={<Menubar/>} />
        <Route path="/forgot_password" element={<Forget/>} />
        <Route path="/reset/:token" element={<Reset/>} />


      </Routes>
    </BrowserRouter>

  )
}
export default App