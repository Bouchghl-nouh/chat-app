module.exports = function softDelete(schema) {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  schema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
  });

  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.deletedAt = null;
    return this.save();
  };
};
