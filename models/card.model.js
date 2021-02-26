module.exports = (sequelize, Sequelize) => {
  //카드 오브젝트
  const card = sequelize.define("cards", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING
    }
  }, {
    timestamps: true,
    underscored: true
  });
  return card;
};

