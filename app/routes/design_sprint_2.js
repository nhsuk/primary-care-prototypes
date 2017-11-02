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
  req.session.multiChoose = multiChoose;

  if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) {
    res.render('design_sprint_2/preferred-times', {
    session: req.session
  });
  } else {
    res.render('design_sprint_2/users-location-online', {
    session: req.session
  });
  }
});

router.get('/preferred-time', function (req, res) {
  var time = req.query.time;
  req.session.time = time;
  multiChoose = req.session.multiChoose;
  
  if (((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) && (multiChoose.includes('choose-online'))) {
    res.render('design_sprint_2/users-location-all3', {
      session: req.session
    });
  } else if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) { 
    res.render('design_sprint_2/users-location', {
      session: req.session
    });
  } else {
    res.render('design_sprint_2/users-online', {
      session: req.session
    });
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
    res.render('design_sprint_2/users-location-all3', {
      session: req.session
    });
  } else if ((multiChoose.includes('choose-location')) || (multiChoose.includes('choose-pharmacy'))) { 
    res.render('design_sprint_2/users-location', {
      session: req.session
    });
  } else {
    res.render('design_sprint_2/users-online', {
      session: req.session
    });
  }
});

router.get('/places-to-go', function (req, res) {
  hasSymptoms = req.session.hasSymptoms; 
  age = req.session.age; 
  multiChoose = req.session.multiChoose;

  if (hasSymptoms === 'yes') {
    if ((multiChoose.length == 3) && (multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy')) && (multiChoose.includes('choose-online'))) {
      res.render('design_sprint_2/results-3', {
        session: req.session
      });
    } else if ((multiChoose.length == 2) && (multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy'))) {
      res.render('design_sprint_2/results-2', {
        session: req.session
      });
    }
    else if ((multiChoose.length == 1) && (multiChoose.includes('choose-location'))) {
      res.render('design_sprint_2/results-1', {
        session: req.session
      });
    }
  } else if (hasSymptoms === 'no') {
      if (multiChoose.length == 3) {
        if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy')) && (multiChoose.includes('choose-online'))) {
          if (parseInt(age) >= 25) {
            res.render('design_sprint_2/results-3', {
              session: req.session
            }); 
          } else {
            res.render('design_sprint_2/results-9', {
              session: req.session
            });
          }
        }
      } else if (multiChoose.length == 2) {
          if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy'))) {
            if (parseInt(age) >= 25) {
              res.render('design_sprint_2/results-2', {
                session: req.session
              }); 
            } else {
              res.render('design_sprint_2/results-10', {
                session: req.session
              });
            } 
          }
          if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-location'))) {
            if (parseInt(age) >= 25) {
              res.render('design_sprint_2/results-7', {
                session: req.session
              });
            } else {
              res.render('design_sprint_2/results-6', {
                session: req.session
              });
            }
          }
          if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-pharmacy'))) {
                  console.log("here");
            res.render('design_sprint_2/results-8', {
              session: req.session
            }); 
          }
      } else if (multiChoose.length == 1) {
          if (multiChoose.includes('choose-location')) {
            res.render('design_sprint_2/results-1', {
              session: req.session
            });
          } else if (multiChoose.includes('choose-pharmacy')) {
            res.render('design_sprint_2/results-5', {
              session: req.session
            });
          } else if (multiChoose.includes('choose-online')) {
            res.render('design_sprint_2/results-4', {
              session: req.session
            });
          }
      }
  }
});

module.exports = router
