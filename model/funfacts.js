const mongoose = require('mongoose');
const {States} = require('../model/db');


async function getFunfact(stateCode) {
    const state = await States.findOne({code: stateCode}).exec();
    return state;
}

async function postFunfact(stateCode, funfacts) {
    const state = await States.updateOne({code: stateCode}, {$push: {funfacts: funfacts}});
    return state;
}

module.exports = {getFunfact, postFunfact};