const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const router = new express.Router();

const secretkey = "drewman++/"
const sequelize = new Sequelize('fbx_VPS_1', 'fbx_VPS2', 'Drewman61}', { host: '162.144.153.206', dialect: 'mysql' });


var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



router.post('/postFile', async (req, res) => {
  let token = jwt.sign(req.body, 'robisthebest', { expiresIn: '2 hours' });
  let sendOut = {};
  sendOut.token = token;
  sendOut.login = true;
  res.send(JSON.stringify(sendOut));
})

router.get('/getUser', async (req, res, next) => {
  let a = await sequelize.query("select displayName,team,userId,security,userPass,lastIP,lastOn,timeOn,timeOnDC,lastOnDC from B4_LOGIN where userName = ?", { replacements: [req.query.user] })
    .then((data) => {
      let theStuff = data[0];
      let sendBack = {};
      if (theStuff[0].userPass === req.query.password) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var timeOnDC = parseInt(theStuff[0].timeOnDC);
        var lastOnDC =  Date.parse(theStuff[0].lastOnDC);
        var userID = theStuff[0].userId;
        sendBack.userId = theStuff[0].userId;
        sendBack.timeOnDC = theStuff[0].timeOnDC + 1;
        if (isNaN(lastOnDC)) {
          sendBack.lastOnDC  = '0000-00-00 00:00:00';
        } else {
          sendBack.lastOnDC = Date.parse(theStuff[0].lastOnDC);
        }
        sendBack.team = theStuff[0].team;
        sendBack.displayName = theStuff[0].displayName;
        sendBack.lastIP = theStuff[0].lastIP;
        sendBack.lastOn = theStuff[0].lastOn;
        sendBack.timeOn = theStuff[0].timeOn;
        sendBack.loggedIn = true;
        let uu = sequelize.query('update B4_LOGIN set timeOnDC = :timeOn, lastOnDC = :theDate where userId = :userId',{
        replacements: { timeOn: timeOnDC+1, theDate : dateTime, userId : userID }
        }).then((data) => {
          return data;
        });
        var token = jwt.sign(sendBack, 'robisthebest', { expiresIn: '1 hour' });
        let returnData = {
          "token": token,
          "login": true
        };
        return (returnData);
      } else {
        sendBack.userId = 0;
        sendBack.team = '-';
        sendBack.displayName = 'No User';
        sendBack.loggedIn = false;
        let token = jwt.sign(sendBack, 'robisthebest', { expiresIn: '1 hour' });
        let returnData = {
          "token": token,
          "login": false
        };
        return (returnData);
      }
    }).catch(
      (ex) => {
        let errorBack = {};
        errorBack.userId = 0;
        errorBack.team = '-';
        errorBack.displayName = 'No User';
        errorBack.loggedIn = false;
        let token = jwt.sign(errorBack, 'robisthebest', { expiresIn: '1 hour' });
        let returnData = {
          "token": token,
          "login": false
        };
        return (returnData);
      }
    );
  res.send(a);
})

router.get('/getBoards', async (req, res, next) => {
  let a = await sequelize.query("select * from A_DraftBoard where memberID = ?", { replacements: [req.query.user] })
    .then((data) => {
      return (data);
    })
    .catch(
      (ex) => {
        return (ex);
      }
    );
  res.send(a);
})

// app.get('/hashAll', async(req,res,next) => {
//     let all = await sequelize.query("select userPass,userId from B4_LOGIN/ order by userId asc",{ type: sequelize.QueryTypes.SELECT})
//     .then (members =>{
//         return members;
//     })
//     console.log(all);
//     all.forEach(async element => {
//         let hashed = await bcrypt.hash(element.userPass,8);
//         let a = await sequelize.query("Update B4_LOGIN/ set passHash = ? where userId = ?",{replacements: [hashed,element.userId]})
//         .then((data)=>{
//             return(data[0].affectedRows)
//         });
//     });
//     next()
// })

// router.post('/changeShownReports1', async (req,res,next) => {
//   let token = await req.body.token;
//   let teamView = req.body.viewTeams;
//   let theString = '';
//   let fbxUser = await jwt.decode(token);
//   await teamView.forEach(element => {
//       theString += element+',';
//   });
//   if (theString.length > 1) theString = theString.slice(0,-1);
//   let a = await sequelize.query("Update B4_LOGIN set newShare = ? where userId = ?",{replacements: [theString,fbxUser.id]})
//   .then((data)=>{
//       return(data[0].affectedRows)
//   });
//   fbxUser.viewTeam = theString;
//   delete fbxUser.exp;
//   let jj = jwt.sign(fbxUser,secretkey,{expiresIn : '15 minutes'});
//   let sendOut = {};
//   sendOut.token = jj;
//   res.send(JSON.stringify(sendOut));

// })

// router.get('/changePass', async (req,res,next) =>{
//     var data = req.query;
//     let fbxUser = await jwt.decode(data.token);
//     let hashed = await bcrypt.hash(data.newPass,8);
//     let a = await sequelize.query("Update B4_LOGIN set passHash = ?, userPass = ? where userId = ?",{replacements: [hashed,data.newPass,fbxUser.id]})
//     .then((data)=>{
//         return(data[0].affectedRows)
//     });
//     res.send(JSON.stringify({"worked":"Yes"}));
// })

// router.get('/', async(req,res) => {
//     res.send(JSON.stringify({"found":"Getter"}));
//     return;
// })

// router.post('/', async(req,res) => {
//         res.send(JSON.stringify({"found":"Post"}));
//         return;
// })

// router.post('/login', async (req, res) => {
//     buildArray = {};
//     myArray = await sequelize.query('SELECT * FROM MEMBER_VIEW where userName = ?',{plain: true,replacements: [req.body.user] })
//     .then((myTableRows) => {
//         if (myTableRows === null){
//            return {hashPass : 'xiiiisidiosufoisux'};
//         }
//         return myTableRows;
//     });
//     testArray = myArray;
//     stupid = await bcrypt.compare(req.body.password,testArray.hashPass).then((response)=>{
//         if (response === true) { return response } else {
//             return response;
//         }
//     });
//     if (stupid === false) {
//         res.send(JSON.stringify({"found":"No"}));
//         return;
//     }
//     reports = await sequelize.query('SELECT COUNT(*) as count FROM ScoutReportView WHERE VisibleTo = ? and scoutnum = ?',{plain: true,replacements: [myArray.TTeam,myArray.userId] })
//     .then((myRows) => {
//         return myRows.count;
//     }).catch((err)=>{
//         console.log('error');
//     });
//     notes = await sequelize.query('SELECT COUNT(*) as count FROM NoteView WHERE VisibleTo = ? and scoutnum = ?',{plain: true,replacements: [myArray.TTeam,myArray.userId] })
//     .then(myNotes => {
//         return myNotes.count;
//     });
//     pdf = await sequelize.query('SELECT COUNT(*) as count FROM preciousFiles WHERE visibleTo = ? and byNumber = ?',{plain: true,replacements: [myArray.TTeam,myArray.userId] })
//     .then(myPDF => {
//         return myPDF.count;
//     });
//     // SECURITY STRING

//     countAdd = await sequelize.query("Update MEMBER_VIEW set timeOn = timeOn + 1, lastOn = ? where userId = ?",{replacements: [new Date(),myArray.userId] })
//     .then(rr=>{
//         return rr[0].affectedRows;
//     });
//     var allowString = '';
//     if (myArray['showS1'] === 'Yes') {allowString+='S1-';}
//     if (myArray['showS2'] === 'Yes') {allowString+='S2-';};
//     if (myArray['showHGSNPQ'] === 'Yes') {allowString+='SNPQ-';};
//     if (myArray['showREPORT'] === 'Yes') {allowString+='R-';};
//     if (myArray['showNOTE'] === 'Yes') {allowString+='N-';};
//     if (myArray['showHWS'] === 'Yes') {allowString+='HD-';};
//     if (myArray['showTRANS'] === 'Yes') {allowString+='TR-';};
//     if (myArray['showSHARED'] === 'Yes') {allowString+='L2-';};
//     if (myArray['showLIST'] === 'Yes') {allowString+='L1-';};
//     if (myArray['showOprah'] === 'Yes') {allowString+='O-';};
//     if (myArray['showEXPORT'] === 'Yes') {allowString+='E-';};
//     if (allowString.length > 1) allowString = allowString.slice(0,-1);
//     buildArray.id = myArray['userId'],
//     buildArray.security = myArray['security'],
//     buildArray.displayName = myArray['displayName'],
//     buildArray.team = myArray['team'],
//     buildArray.timeOn = myArray['timeOn'],
//     buildArray.lastON = myArray['lastOn'],
//     buildArray.lastIP = myArray['lastIP'],
//     buildArray.saveState = myArray['saveState'],
//     buildArray.email = myArray['email'],
//     buildArray.phone = myArray['phone'],
//     buildArray.league = myArray['league'],
//     buildArray.permissions = allowString,
//     buildArray.viewTeamOptions= myArray['newShareOption'],
//     buildArray.viewTeam= myArray['newShare'],
//     buildArray.impnip = myArray['cfl'];
//     buildArray.reports = reports;
//     buildArray.notes = notes;
//     buildArray.pdf = pdf;
//     let jj = jwt.sign(buildArray,secretkey,{expiresIn : '10 minute'});
//     let sendOut = {};
//     sendOut.token = jj;
//     sendOut.found = 'Yes';
//     res.send(JSON.stringify(sendOut));
// });

module.exports = router;