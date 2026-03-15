const minioClient = require("../config/minio");
const generateKey = require("../utils/generateKey");

const bucket = process.env.MINIO_BUCKET;

exports.getUploadUrl = async (req, res) => {
  try{
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: "Missing filename" });
  
    const key = generateKey("userId", filename);
  
    const uploadUrl = await minioClient.presignedPutObject(
      bucket,
      key,
      3600
    );
  
    res.json({ uploadUrl, key });
  }catch(e){
    console.error("error getting the UploadUrl");
    res.status(500).json({error:"the server down"});
  }
};

exports.getDownloadUrl = async (req, res) => {
  try{
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });
  
    const downloadUrl = await minioClient.presignedGetObject(
      bucket,
      key,
      3600
    );
  
    res.json({ downloadUrl });
  }catch(e){
    console.error("error while getting the file",e.message);
    res.status(500).json({downloadUrl:""});
  }
};
