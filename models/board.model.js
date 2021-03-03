module.exports = (sequelize, Sequelize) => {
  const Board = sequelize.define("boards", {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
    underscored: true
  });
  
  // 관계 설정
  Board.associate = function(models) {
    // 보드에 접근 가능한 유저들
    Board.belongsToMany(models.users, {
      through: 'users_boards',
      foreignKey: 'board_id'
    });
    // 보드에 입력된 리스트들
    Board.hasMany(models.lists, { 
      //외래키 생성 설정
      foreignKey: { allowNull: false }, 
      //보드 삭제시 리스트 같이 삭제
      onDelete: 'CASCADE' 
    });
  };

  // Board.associate = function(models) {

  // };
  return Board;
};