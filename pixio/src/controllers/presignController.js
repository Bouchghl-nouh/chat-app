const minioClient = require("../config/minio");
const generateKey = require("../utils/generateKey");

const bucket = process.env.MINIO_BUCKET;

exports.getUploadUrl = async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Missing filename" });

  const key = generateKey("userId", filename);

  const uploadUrl = await minioClient.presignedPutObject(
    bucket,
    key,
    3600
  );

  res.json({ uploadUrl, key });
};

exports.getDownloadUrl = async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  const downloadUrl = await minioClient.presignedGetObject(
    bucket,
    key,
    3600
  );

  res.json({ downloadUrl });
};
