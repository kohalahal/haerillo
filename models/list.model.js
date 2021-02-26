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
  
  // 관계 설정
  // 리스트에 입력된 카드들
  list.associate = function(models) {
    list.hasMany(models.cards, {
      foreignKey: 'listId'
    });
  };
  return list;
};

