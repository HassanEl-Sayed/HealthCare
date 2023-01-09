var createError = require('http-errors');
var express = require('express');
const cors = require('cors')
var logger = require('morgan');
require('./dbConnection/mongoose')

//Routers
var usersRouter = require('./routes/users');
var doctorRouter = require('./routes/doctors');
var areaRouter = require('./routes/areas');
var specialtiesRouter = require('./routes/specialties');
var typesRouter = require('./routes/types');
var hospitalsRouter = require('./routes/hospitals');
var clinicsRouter = require('./routes/clinics');
var labsRouter = require('./routes/labs');
var xraysRouter = require('./routes/xrays');
var insurancesRouter = require('./routes/insurances');
var hcInsValuesRouter = require('./routes/hcInsValues');
var xlInsValuesRouter = require('./routes/xlInsValues');
var branchesHCRouter = require('./routes/branchesHc');
var branchesXLRouter = require('./routes/branchesXL');
var drAvailTimeRouter = require('./routes/drAvailTime');
var xlAvailTimeRouter = require('./routes/xlAvailTime');
var bookingHCRouter = require('./routes/bookingHC');
var bookingXLRouter = require('./routes/bookingXL');
var paymentRouter = require('./routes/payments');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())


//Use Routers
app.use('/users', usersRouter);
app.use('/doctors', doctorRouter);
app.use(areaRouter);
app.use('/specialties',specialtiesRouter);
app.use('/types',typesRouter);
app.use('/hospitals',hospitalsRouter);
app.use('/clinics',clinicsRouter);
app.use('/labs',labsRouter);
app.use('/xrays',xraysRouter);
app.use(insurancesRouter);
app.use('/hcInsValues',hcInsValuesRouter);
app.use('/xlInsValues',xlInsValuesRouter);
app.use('/branchesHC',branchesHCRouter);
app.use('/branchesXL',branchesXLRouter);
app.use('/drAvailTime',drAvailTimeRouter);
app.use('/xlAvailTime',xlAvailTimeRouter);
app.use('/bookHC',bookingHCRouter);
app.use('/bookXL',bookingXLRouter);
app.use('/payments',paymentRouter);

const port = process.env.PORT 
app.listen(port,()=>{
  console.log('Server is up on Port '+port)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

module.exports = app;
