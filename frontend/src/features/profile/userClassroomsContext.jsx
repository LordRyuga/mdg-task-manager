import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const UserClassroomContext = createContext();

export const UserClassroomContextProvider = ({children}) => {
    const [userClassrooms, setUserClassrooms] = useState(null);
    const fetchUserClassrooms = async () => {
        try{
            const response = await axios.get('/api/classrooms/getAllClassrooms/');
            // console.log(response.data);
            setUserClassrooms(response.data);
        }catch(error)
        {
            console.log("user not logged in");
            // console.log(error);
            setUserClassrooms(null);
        }
    }

    useEffect(() => {
        fetchUserClassrooms();
    }, []);

    return (
        <UserClassroomContext.Provider value={{userClassrooms, setUserClassrooms, fetchUserClassrooms }}>
            {children}
        </UserClassroomContext.Provider>
    );
};

export const useUserClassroom = () => useContext(UserClassroomContext);