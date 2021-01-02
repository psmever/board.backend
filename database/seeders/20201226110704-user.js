'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');
const { v4 : uuidv4 } = require('uuid');
require("dotenv").config();

const env = process.env;

let userJson = []
try {
    userJson = JSON.parse(fs.readFileSync('storage/server/user.json'));
} catch (err) {
    userJson = [];
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    if(userJson.length === 0 ) return;

    const ids = await queryInterface.bulkInsert('users', userJson.map((element) => {
        return {
         user_uuid: uuidv4(),
         user_name: element.user_name,
         user_password: bcrypt.hashSync(element.user_password, Number(env.BCRYPT_SALTROUNDS)),
         user_email: element.user_email,
         user_level: element.user_level,
         active: 'Y',
         profile_active: 'Y',
        }
    })).then(async () => {
        return await queryInterface.sequelize.query( `SELECT id from users order by id asc`,{raw: true, nest: true});
    }).catch((err)=> {console.log(err);});

    await queryInterface.bulkInsert('user_profile', ids.map((element) => {
        return {
            user_id: element.id
        }
    }), {}).catch((err)=> {console.log(err);});

    await queryInterface.bulkInsert('user_email_auth', ids.map((element) => {
        return {
            user_id: element.id,
            verify_code: Array.from({ length: 70 }, () => Math.random().toString(36)[2]).join(''),
            verify_status: 'Y',
        }
    }), {}).catch((err)=> {console.log(err);});

    await queryInterface.bulkInsert('user_type', ids.map((element) => {
        return {
            user_id: element.id,
            user_type: 'A30010',
        }
    }), {}).catch((err)=> {console.log(err);});

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_profile', null, {});
    await queryInterface.bulkDelete('user_email_auth', null, {});
    await queryInterface.bulkDelete('user_type', null, {});
  }
};
