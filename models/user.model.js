module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
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
    //비밀번호 입력 일치 확인용 버추얼 컬럼
    passwordConfirmation: {
      type: Sequelize.VIRTUAL
    },
    email: {
      type: Sequelize.STRING,
      //이메일 형식 확인
      validate: {
        // isEmail: true
      },
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
    underscored: true
  });
  // 관계 설정
  // 유저가 접근 가능한 보드들
  User.associate = function(models) {
    User.belongsToMany(models.boards, {
      through: 'users_boards',
      foreignKey: 'user_id'
    });
  };


  //클래스 메소드

  //중복없는 이메일인지 체크
  User.isNewEmail = function(emailParam) {
    User.findOne({ where: {email: emailParam} }).then(function(user) {
      //검색 결과 중 첫 번째 유저 혹은 null
      if(user === null) {
        console.log("이멜통과!");
        return true;
      }
      return false;
    })    
  };
  //중복없는 아이디인지 체크
  User.isNewUsername = function(usernameParam) {
    User.findOne({ where: {username: usernameParam} }).then(function(user) {
      //검색 결과 중 첫 번째 유저 혹은 null
      if(user === null) {
        console.log("유저네임통과!");
        return true;
      }
      return false;
    })    
  };

  return User;
};
