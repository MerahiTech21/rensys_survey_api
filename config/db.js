const Sequelize= require('sequelize');
const {DataTypes} = require('sequelize');

const sequelize= new Sequelize('merahitechnologi_survey_system','merahitechnologi_cold_room_user','C}LeGld72#_c',{dialect:'mysql',host:'merahitechnologies.com',port:'3306',});

// try { 
//     sequelize.authenticate();   
//     console.log('Sequelize Connection has been established successfully.'); 
//   } catch (error) {
//     console.log('Sequelize Unable to connect to the database:');
//   }
    
module.exports= sequelize;