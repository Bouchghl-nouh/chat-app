const sharp = require("sharp");
const minioClient = require("../config/minio");
const parseTransform = require("../utils/parseTransform");

const bucket = process.env.MINIO_BUCKET;

exports.transformImage = async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key parameter" });
  
  const transform = parseTransform(req.query);

  try {
    const stream = await minioClient.getObject(bucket, key);

    let image = sharp();

    if (transform.width || transform.height) {
      image = image.resize(transform.width, transform.height);
    }

    if (transform.format) {
      image = image.toFormat(transform.format, {
        quality: transform.quality,
      });
      res.type(transform.format);
    }

    stream.pipe(image).pipe(res);
  } catch (err) {
    res.status(404).json({ error: "Image not found" });
  }
};
