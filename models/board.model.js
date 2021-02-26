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
  // 보드에 접근 가능한 유저
  board.associate = function(models) {
    board.belongsToMany(models.users, {
      through: 'users_boards',
      foreignKey: 'boardId'
    });
  };
  return board;
};