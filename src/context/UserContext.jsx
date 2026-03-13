import { createContext } from "react";
import useAuth from "../hooks/useAuth";
import  useTeam  from "../hooks/useTeam";

const Context = createContext()

function UserProvider({ children }) {
    const { createTeam } = useTeam()
    const { register, authenticated, login, logout  } = useAuth()
    return (
        <Context.Provider value={{ register, authenticated, login, logout, createTeam }} >
            {children}
        </Context.Provider>
    )
}
export{Context, UserProvider}