import iziToast from "izitoast"
import "izitoast/dist/css/iziToast.min.css"

import { getImagesByQuery } from "./js/pixabay-api.js"

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js"

const form = document.querySelector(".form")
const loadBtn = document.querySelector(".loadBtn")
let page = 1
let searchQuery = ""
let loadedImages = 0
form.addEventListener("submit", async event => {
  event.preventDefault()
  const formData = new FormData(form)
  const query = formData.get("search-text").trim()
  if (query === "") {
    iziToast.warning({
      message: "Please enter a search query!",
      position: "topRight",
    })
    return
  }
  searchQuery = query
  page = 1
  loadedImages = 0
  clearGallery()
  hideLoadMoreButton()
  showLoader()
    try {
    const data = await getImagesByQuery(searchQuery, page)
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        })
        return
      }
      createGallery(data.hits)
      loadedImages += data.hits.length
      if (loadedImages >= data.totalHits) {
        hideLoadMoreButton()
        iziToast.error({
            message: "We're sorry, but you've reached the end of search results.",
            position: "topRight",
      })
      }
      showLoadMoreButton()
    }
    catch(error) {
      iziToast.error({
        message: "Something went wrong. Please try again!",
        position: "topRight",
      })
      }
    finally {
      hideLoader()
    }
  form.reset()
})

loadBtn.addEventListener("click", async event =>{
    page += 1
    showLoader()
    try{ 
    const data = await getImagesByQuery(searchQuery, page)
    loadedImages += data.hits.length
    if (loadedImages >= data.totalHits) {
    hideLoadMoreButton()
    iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      })
    }
    createGallery(data.hits)
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect()

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    })
    }catch(error) {
    page -= 1
    iziToast.warning({
      message: "Error, cant load more!",
      position: "topRight",
    })
    }finally{
      hideLoader()
    }
})