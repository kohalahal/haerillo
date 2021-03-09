module.exports = (sequelize, Sequelize) => {
  //리스트 오브젝트
  const List = sequelize.define("lists", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING
    },
    index: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
    underscored: true
  });

  // 관계 설정
  // 리스트에 입력된 카드들
  List.associate = function(models) {
    List.hasMany(models.cards, { 
      //외래키 생성 설정
      foreignKey: { allowNull: false }, 
      //리스트 삭제시 카드 같이 삭제
      onDelete: 'CASCADE' 
    });
  };
  return List;
};

