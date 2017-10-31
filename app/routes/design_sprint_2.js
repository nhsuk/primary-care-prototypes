var express = require('express')
var router = express.Router()

var request = require('request')
var naturalSort = require('javascript-natural-sort')

// design_sprint_2 prototype.
// URL structure is /design_sprint_2/ROUTE

 
router.get('/intro', function (req, res) {
  req.session.destroy();
  res.render('design_sprint_2/intro', {
    suppressServiceName: true
  });
});

router.get('/check-for-symptoms', function (req, res) {
  res.render('design_sprint_2/check-for-symptoms', {
    session: req.session
  });
});

router.get('/users-age', function (req, res) {
  var hasSymptoms = req.query.hasSymptoms;
  req.session.hasSymptoms = hasSymptoms;
  res.render('design_sprint_2/users-age', {
    session: req.session
  });
});

router.get('/choices', function (req, res) {
  var age = req.query.age;
  req.session.age = age;
  hasSymptoms = req.session.hasSymptoms;
  if (parseInt(age) < 16) {
    res.render('design_sprint_2/under16');
  } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
    if (hasSymptoms === 'yes') {
      res.render('design_sprint_2/choose-where-if-yes-u25', {
        session: req.session
      });
    } else {
      res.render('design_sprint_2/choose-where-u25', {
        session: req.session
      });
    }
  } else {
    if (hasSymptoms === 'yes') {
      res.render('design_sprint_2/choose-where-if-yes', {
        session: req.session
      });
    } else {
      res.render('design_sprint_2/choose-where', {
        session: req.session
      });
    }
  }
});

router.get('/need-time', function (req, res) {
  var multiChoose = req.query.multiChoose;
  if (multiChoose == undefined) {
    req.session.multiChoose = 'choose-location';
  } else {
    req.session.multiChoose = multiChoose;
  }

  if ((multiChoose == 'choose-location') || (multiChoose == 'choose-both')) {
    res.render('design_sprint_2/preferred-times');
  } else {
    res.render('design_sprint_2/users-location-online');
  }
});

router.get('/preferred-time', function (req, res) {
  var time = req.query.time;
  req.session.time = time;
  res.render('design_sprint_2/location')

});

router.get('/location', function (req, res) {
  var time = req.query.time;
  req.session.time = time;
  multiChoose = req.session.multiChoose;

  if (multiChoose == 'choose-location') {
    res.render('design_sprint_2/users-location');
  } else {
    res.render('design_sprint_2/users-location-both');
  }
});

module.exports = router
