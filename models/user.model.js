module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
    underscored: true
  });

  // 관계 설정
  // 유저가 접근 가능한 보드
  user.associate = function(models) {
    user.hasMany(models.boards, {
      foreignKey: 'userId'
    });
  };

  return user;
};