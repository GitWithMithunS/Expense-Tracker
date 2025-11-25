import { useContext } from "react"
import Navbar from "./Navbar"
import AppContext from "../context/AppContext"
import Sidebar from "./Sidebar"
const Dashboard = () => {
    
    const {user} = useContext(AppContext);

    ( () => console.log(user ,"frm dashboard"))(); 

    return (
        <>
            <div>
                <Navbar />

                {user && (
                    <div className="flex">
                        <div className="max-[1080px]:hidden">
                            {/* side bar content */}
                            <Sidebar/>
                        </div>

                        <div className="grow mx-5">Right side content</div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Dashboard