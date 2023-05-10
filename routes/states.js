const router = require('express').Router();
const mongoose = require('mongoose');

const states = require('../model/states.json');

const {getFunfact, postFunfact} = require("../model/funfacts");

const checkCode = (req, res, next) => {
    const code = req.params.state;
    if (!states.find((s) => s.code == code)) {
        console.log(`State ${code} not found`);
        res.status(404);
        res.end();

        return;
    }
    next();
}

router.get("/", (req, res) => {
    const contig = req.query.contig; 

    let allStates = [];
    if (contig == undefined) {
        allStates = states;
    } else if (contig == true) {
        allStates = states.filter((s) => s.code !== "AK" && s.code !== "HI");
    } else {
        allStates = states.filter((s) => s.code === "AK" || s.code === "HI");
    }

    res.json(allStates);
    res.end();
});

router.get("/:state", checkCode, (req, res) => {
    const stateCode = req.params.state;
    const foundState = states.find((s) => s.code == stateCode);
    if (foundState == undefined) {
        res.status(404);
    }
    else {
        res.json(foundState);
    }
    res.end();
});

router.get("/:state/capital", checkCode, (req, res) => {
    const code = req.params.state;
    const stateObject = states.find((s) => s.code == code);

    res.json({state: stateObject.state, capital: stateObject.capital_city});
    res.end();
});

router.get("/:state/nickname", checkCode, (req, res) => {
    const code = req.params.state;
    const stateObject = states.find((s) => s.code == code);

    res.json({state: stateObject.state, nickname: stateObject.nickname});
    res.end();
});

router.get("/:state/population", checkCode, (req, res) => {
    const code = req.params.state;
    const stateObject = states.find((s) => s.code == code);

    res.json({state: stateObject.state, population: stateObject.population});
    res.end();
});

router.get("/:state/admission", checkCode, (req, res) => {
    const code = req.params.state;
    const stateObject = states.find((s) => s.code == code);

    res.json({state: stateObject.state, admitted: stateObject.admission_date});
    res.end();
});

router.get("/:state/funfact", checkCode, async (req, res) => {
    const stateCode = req.params.state;
    const funfact = await getFunfact(stateCode);
    const randIndex = Math.floor(Math.random() * funfact.funfacts.length);

    res.json({funfact: funfact.funfacts[randIndex]});
    res.end();
});

router.post("/:state/funfact", checkCode, async (req, res) => {
    const stateCode = req.params.state;
    console.log(req.body);
    const funfacts = req.body.funfacts;
    if (funfacts == undefined) {
        res.status(400);
        res.json({error: "No field called funfacts in body"});
        res.end();
        return;
    }

    console.log(await postFunfact(stateCode, funfacts));
    res.status(200);
    res.end();
});

router.patch("/:state/funfact", checkCode, (req, res) => {

});

router.delete("/:state/funfact", checkCode, (req, res) => {

});

module.exports = router;