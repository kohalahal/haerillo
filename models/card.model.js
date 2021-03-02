module.exports = (sequelize, Sequelize) => {
  //카드 오브젝트
  const card = sequelize.define("cards", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    index: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
    underscored: true
  });
  return card;
};

