import { createContext, useState } from 'react'

// @ts-ignore
export const UserContext = createContext<any>();

const UserContextProvider = ({children}:any) => {
    const [user, setUser] = useState('');
    return (
        <UserContext.Provider value = {[user,setUser]}>
            {children}
        </UserContext.Provider>

    )
}
export default UserContextProvider