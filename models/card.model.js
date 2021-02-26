module.exports = (sequelize, Sequelize) => {
  const card = sequelize.define("cards", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    listId: {
      type: Sequelize.INTEGER
    },
    content: {
      type: Sequelize.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
  underscored: true
});

  return card;
};