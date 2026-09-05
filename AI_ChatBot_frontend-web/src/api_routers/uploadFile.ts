import axios from "axios";


export async function uploadFile( file: File ) {
    const response = await axios.post(`http://localhost:8000/upload`, file)

    console.log("received response from backend" , response.data)
    return response.data
}   