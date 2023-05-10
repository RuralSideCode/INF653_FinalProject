const router = require('express').Router();
const mongoose = require('mongoose');

const states = require('../model/states.json');

const {getFunfacts, postFunfact, patchFunfact, removeFunfact} = require("../model/funfacts");

const checkCode = (req, res, next) => {
    const code = req.params.state;
    if (!states.find((s) => s.code == code)) {
        console.log(`State "${code}" not found`);
        res.status(404);
        res.end();

        return;
    }
    next();
}

router.get("/", async (req, res) => {
    const contig = req.query.contig; 

    let allStates = [];
    if (contig == undefined) {
        allStates = states;
    } else if (contig == true) {
        allStates = states.filter((s) => s.code !== "AK" && s.code !== "HI");
    } else {
        allStates = states.filter((s) => s.code === "AK" || s.code === "HI");
    }

    allStates = await Promise.all(allStates.map(async (s) => {
        const funfacts = await getFunfacts(s.code);
        if (funfacts == undefined) return s;

        if (s.funfacts == undefined) {
            s.funfacts = [];
        }

        s.funfacts = funfacts;
        return s;
    }));

    res.json(allStates);
    res.end();
});

router.get("/:state", checkCode, async (req, res) => {
    const stateCode = req.params.state;
    const foundState = states.find((s) => s.code == stateCode);
    if (foundState == undefined) {
        res.status(404);
    }
    else {
        const funfacts = await getFunfacts(stateCode);
        if (foundState.funfacts == undefined && funfacts.length != 0) foundState.funfacts = funfacts;
        else if (foundState.funfacts != undefined) foundState.funfacts.push(...funfacts);

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
    const funfacts = await getFunfacts(stateCode);

    if (funfacts.length == 0) {
        res.json({funfact: []});
        res.end();
        return;
    }

    const randIndex = Math.floor(Math.random() * funfacts.length);

    res.json({funfact: funfacts[randIndex]});
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

router.patch("/:state/funfact", checkCode, async (req, res) => {
    const stateCode = req.params.state;

    const index = req.body.index;
    const funfact = req.body.funfact;

    console.log(await patchFunfact(stateCode, index, funfact));
    res.status(200);
    res.end();
});

router.delete("/:state/funfact", checkCode, async (req, res) => {
    const stateCode = req.params.state;
    const index = req.body.index;
    console.log(await removeFunfact(stateCode, index));

    res.status(200);
    res.end();
});

module.exports = router;