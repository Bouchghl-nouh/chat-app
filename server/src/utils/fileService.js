const axios = require("axios");

const fileService = axios.create({
  baseURL:process.env.PIXIO_URI
})
const upload = async(filename) =>{
return await fileService.post("/upload-url",{filename})
}
const getPresignedUrl = async(url)=>{
  return await fileService.get("/download-url",{
    params:{
      key:url
    }
  })
}
module.exports = {upload,getPresignedUrl} ;