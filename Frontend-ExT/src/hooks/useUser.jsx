import React, { useEffect } from 'react'
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../util/apiEnpoints';
import axiosConfig from '../util/axiosConfig';

//custom hook for auto-login on page refresh 
//(remember to add this to protected pages once we connect to backend)
export const useUser = () => {
  
    const {user , setUser , clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            return;
        }

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

                if(isMounted && response.data){
                    setUser(response.data);
                }
            } catch (error) {
                console.log('Failed to fetching user info : ' , error);
                if(isMounted){
                    clearUser();
                    navigate('/login');
                }
            }
        }

        fetchUserInfo();
    
        //cleanup function
        return () => {
            isMounted = false;
        }

    } , [setUser , clearUser , navigate]);


}
