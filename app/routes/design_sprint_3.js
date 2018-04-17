var express = require('express')
var router = express.Router()

var request = require('request')
var naturalSort = require('javascript-natural-sort')

// design_sprint_3 prototype.
// URL structure is /design_sprint_2/ROUTE


router.get('/intro', function (req, res) {
  req.session.destroy();
  res.render('design_sprint_3/intro', {
    suppressServiceName: true
  });
});

router.get('/check-for-symptoms', function (req, res) {
  res.render('design_sprint_3/check-for-symptoms', {
    session: req.session
  });
});

router.get('/users-age', function (req, res) {
  var hasSymptoms = req.query.hasSymptoms;
  req.session.hasSymptoms = hasSymptoms;
  res.render('design_sprint_3/users-age');
});

router.get('/choices', function (req, res) {
  var age = req.query.age;
  req.session.age = age;
  hasSymptoms = req.session.hasSymptoms;
  if (parseInt(age) < 16) {
    res.render('design_sprint_3/under16');
  } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
    if (hasSymptoms === 'yes') {
      res.render('design_sprint_3/choose-where-if-yes-u25');
    } else {
      res.render('design_sprint_3/choose-where-u25');
    }
  } else {
    if (hasSymptoms === 'yes') {
      res.render('design_sprint_3/choose-where-if-yes');
    } else {
      res.render('design_sprint_3/choose-where');
    }
  }
});

router.get('/need-time', function (req, res) {
  var multiChoose = req.query.multiChoose;
  req.session.multiChoose = multiChoose;

  if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) {
    res.render('design_sprint_3/preferred-times');
  } else {
    res.render('design_sprint_3/users-location-online');
  }
});

router.get('/preferred-time', function (req, res) {
  var time = req.query.time;
  req.session.time = time;
  multiChoose = req.session.multiChoose;

  if (((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) && (multiChoose.includes('choose-online'))) {
    res.render('design_sprint_3/users-location-all3');
  } else if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) {
    res.render('design_sprint_3/users-location', {
      session: req.session
    });
  } else {
    res.render('design_sprint_3/users-online');
  }
});

router.get('/location', function (req, res) {
  var time = req.query.time;
  req.session.time = time;
  multiChoose = req.session.multiChoose;
  if (multiChoose == 'undefined') {
    multiChoose = req.query.multiChoose;
  }

  if (((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) && (multiChoose.includes('choose-online'))) {
    res.render('design_sprint_3/users-location-all3');
  } else if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) {
    res.render('design_sprint_3/users-location', {
      session: req.session
    });
  } else {
    res.render('design_sprint_3/users-online');
  }
});

router.get('/places-to-go', function (req, res) {
  hasSymptoms = req.session.hasSymptoms;
  age = req.session.age;
  multiChoose = req.session.multiChoose;

  if (hasSymptoms === 'yes') {
    if (multiChoose.includes('choose-location')) {
      res.render('design_sprint_3/results-1');
    }
  } else if (hasSymptoms === 'no') {
      if (multiChoose.length == 3) {
        if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy')) && (multiChoose.includes('choose-online'))) {
          if (parseInt(age) >= 25) {
            res.render('design_sprint_3/results-3');
          } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
            res.render('design_sprint_3/results-9');
          }
        }
      } else if (multiChoose.length == 2) {
          if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy'))) {
            if (parseInt(age) >= 25) {
              res.render('design_sprint_3/results-2');
            } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
              res.render('design_sprint_3/results-10');
            }
          }
          if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-location'))) {
            if (parseInt(age) >= 25) {
              res.render('design_sprint_3/results-7');
            } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
              res.render('design_sprint_3/results-6');
            }
          }
          if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-pharmacy'))) {
            res.render('design_sprint_3/results-8');
          }
      } else {
          if (multiChoose.includes('choose-location')) {
            res.render('design_sprint_3/results-1');
          }
          if (multiChoose.includes('choose-pharmacy')) {
            res.render('design_sprint_3/results-5');
          } 
          if (multiChoose.includes('choose-online')) {
            res.render('design_sprint_3/results-4');
          }
      }
  }
  req.session.destroy();
});

module.exports = router
