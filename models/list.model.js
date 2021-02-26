module.exports = (sequelize, Sequelize) => {
  //리스트 오브젝트
  const list = sequelize.define("lists", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  }, {
    underscored: true
  });
  // 리스트가 속한 보드
  list.associate = function(models) {
    list.belongsTo(models.boards);
  };
  return list;
};

