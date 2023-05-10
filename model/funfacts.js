const mongoose = require('mongoose');
const {States} = require('../model/db');
const statesJSON = require('./states.json');

async function getFunfacts(stateCode) {
    const state = await States.findOne({code: stateCode}).exec();
    const stateJson = statesJSON.find((s) => s.code == stateCode);

    let funfacts = [];
    // We are not guaranteed that the state is in mongodb, so we have to do several checks
    if (state != undefined && state.funfacts != undefined) funfacts.push(...state.funfacts);
    if (stateJson.funfacts != undefined) funfacts.push(...stateJson.funfacts);

    return funfacts;
}

// async function getFunfacts(stateCode) {
    // const state = await States.findMany({code: stateCode}).exec();
    // return state;
// }

async function postFunfact(stateCode, funfacts) {
    const state = await States.updateOne({code: stateCode}, 
        {code: stateCode, $push: {funfacts: funfacts}}, 
        {upsert: true}
    );
    return state;
}

async function patchFunfact(stateCode, index, funfact) {
    const state = await States.findOne({code: stateCode});

    // If the index is out the the bounds of the funfacts array, then do nothing
    if (index < 0 || index - 1 > state.funfacts.length) {
        return;
    }

    state.funfacts[index - 1] = funfact;
    const stateUpdate = States.findOneAndUpdate({code: stateCode}, state, {new: true});
    return stateUpdate;
}

async function removeFunfact(stateCode, index) {
    const state = await States.findOne({code: stateCode});
    if (state == undefined) {
        return;
    }

    if (index < 0 || index - 1 > state.funfacts.length) {
        return;
    }

    state.funfacts.splice(index - 1, 1);
    const stateUpdate = States.findOneAndUpdate({code: stateCode}, state, {new: true});
    return stateUpdate;
}

module.exports = {getFunfacts, postFunfact, patchFunfact, removeFunfact};