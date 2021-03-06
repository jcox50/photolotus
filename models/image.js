'use strict';
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    Name: DataTypes.STRING,
    Path: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Image.associate = function (models) {
    // An image belongs to a user
    Image.belongsTo(models.User, { foreignKey: 'id', as: 'user' });
    // An image belongs to many albums
    Image.belongsToMany(models.Album, { through: 'ImagesAndAlbums', foreignKey: 'id', as: 'albums' });
  };
  return Image;
};