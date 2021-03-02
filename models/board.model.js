module.exports = (sequelize, Sequelize) => {
  const board = sequelize.define("boards", {
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
  // 보드에 접근 가능한 유저들
  board.associate = function(models) {
    board.belongsToMany(models.users, {
      as: 'User',
      through: 'users_boards',
      foreignKey: 'board_id'
    });
  };
  // 보드에 입력된 리스트들
  board.associate = function(models) {
    board.hasMany(models.lists, { 
      //외래키 생성 설정
      foreignKey: { allowNull: false }, 
      //보드 삭제시 리스트 같이 삭제
      onDelete: 'CASCADE' 
    });
  };
  return board;
};