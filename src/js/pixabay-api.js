import axios from "axios"

const api_key = "58609900-1d96609c8fd00f152489c4493"
const base_URL = "https://pixabay.com/api/"

export async function getImagesByQuery (query, page) {
const response = await axios.get(base_URL, {params: {
    key: api_key,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: page,
    per_page: 15,
   },
 });
return response.data 
}