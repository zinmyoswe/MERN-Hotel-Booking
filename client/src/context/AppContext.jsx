import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";    
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({children}) => {

    const currency = import.meta.env.VITE_CURRENCY || '$';
    const {user} =useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate();

    const[isOwner, setIsOwner] =useState(false)
    const[showHotelRegister, setShowHotelRegister] =useState(false)
    const[searchedCities, setSearchedCities] =useState([])

    const fetchUser = async() => {
        try {
            const {data} = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if(data.success){
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities);
            }else{
                //Retry Fetching User Data after 5s
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(user){
            fetchUser();
        }
    }, [user])


    const value = {
        currency,
        navigate,
        user,
        getToken,
        location,
        isOwner,
        setIsOwner,
        axios,
        showHotelRegister,
        setShowHotelRegister,
        searchedCities,
        setSearchedCities
    }

    return(
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)