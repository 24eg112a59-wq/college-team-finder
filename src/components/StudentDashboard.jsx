import {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import { fetchStudentData } from "../api/student"; 
import { fetchProtectError } from "../api/authApi";

function StudentDashboard() {
    const {auth,logout}=useAuth();
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetchProtectError("/api/user/dashboard",auth.token)
        .then(setMessage)
        .catch((err) => setMessage(err.message));
    }, [auth.token]);
    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>{message}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
export default StudentDashboard;