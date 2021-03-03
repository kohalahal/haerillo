'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// const User = require("../models").users;
// const Board = require("../models").boards;
// const List = require("../models").lists;
// const Card = require("../models").cards;


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// // 관계 설정
// User.belongsToMany(Board, {
//   through: 'users_boards',
//   foreignKey: 'user_id'
// });
// Board.belongsToMany(User, {
//   through: 'users_boards',
//   foreignKey: 'board_id'
// });
// Board.hasMany(List, { 
//   //외래키 생성 설정
//   foreignKey: { allowNull: false }, 
//   //보드 삭제시 리스트 같이 삭제
//   onDelete: 'CASCADE' 
// });
// List.hasMany(Card, { 
//   //외래키 생성 설정
//   foreignKey: { allowNull: false }, 
//   //리스트 삭제시 카드 같이 삭제
//   onDelete: 'CASCADE' 
// });




db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
