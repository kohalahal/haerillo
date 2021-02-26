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
  // 관계 설정
  // 카드가 속한 리스트
  card.associate = function(models) {
    card.belongsTo(models.lists);
  };

  return card;
};