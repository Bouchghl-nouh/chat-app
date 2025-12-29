const optimiseFile = (query) => {
  return {
    width: query.width ? parseInt(query.width) : null,
    height: query.height ? parseInt(query.height) : null,
    format: query.format || null,
    quality: query.quality ? parseInt(query.quality) : 80,
  };
};

module.exports = optimiseFile;