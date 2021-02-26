module.exports = (sequelize, Sequelize) => {
  const board = sequelize.define("boards", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
    underscored: true
  });
  // 관계 설정
  // 보드에 입력된 리스트
  board.associate = function(models) {
    board.hasMany(models.lists, {
      foreignKey: 'boardId'
    });
  };
  return board;
};