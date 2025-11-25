import { useContext } from "react"
import Navbar from "./Navbar"
import AppContext from "../context/AppContext"
import Sidebar from "./Sidebar"


const Dashboard = ({children , activeMenu}) => {
    
    const {user} = useContext(AppContext);

    ( () => console.log(user ,"frm dashboard"))(); 

    return (
        <>
            <div>
                <Navbar activeMenu={activeMenu} />

                {user && (
                    <div className="flex">
                        <div className="max-[1080px]:hidden">
                            {/* side bar content */}
                            <Sidebar activeMenu={activeMenu}/>
                        </div>

                        <div className="grow mx-5">{children}</div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Dashboard