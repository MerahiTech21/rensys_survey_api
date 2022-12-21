
const sequelize = require("../config/db");
const {DataTypes}= require('sequelize');

const Encoder=sequelize.define('encoder',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false,
    }, 

    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    phoneNo:{
      type:DataTypes.STRING,
      
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports= Encoder;