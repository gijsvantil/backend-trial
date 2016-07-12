const express = require('express');
const Sequelize = require('sequelize');
const Promise = require('promise');
const moment = require('moment');
const bodyParser = require('body-parser')
// requiring database model
const db = require('./db/database')

const app = express();

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }))

// Setting PUG as view engine
app.set('views', './views');
app.set('view engine', 'pug');

// function to select begin and endstamp from month
function getMonthDateRange(year, month) {
// array is 'year', 'month', 'day', etc
let startDate = moment([year, month]).add("month");
let endDate = moment(startDate).endOf('month');
return { start: Math.floor(startDate / 1e3), end: Math.floor(endDate / 1e3) };
}

// function to convert month string to month number
function monthToNumber(month) {
	return new Date(Date.parse("1 "+ month)).getMonth();
}

app.get('/', (req, res) => {
// GET that listens on '/' and renders the report landing page
	res.render('index')
})

// MONTHLY REPORTS
app.post('/report', (req, res) => {
	let report = {
		month: req.body.month + " " + req.body.year,
		bookings: 0,
		bookers: 0,
		revenue: 0,
		commission: "",
		profit: 0,
		averageRevenue: 0,
		averageProfit: 0
	}
	// process commission input and add to report
	let commission = (req.body.commission/100)
	report.commission =(commission * 100) + " %"
	// process date input
	let month=monthToNumber(req.body.month)
	let year=(req.body.year)
	let daterange = getMonthDateRange(year, month)
	
	// find all bookings in a specific month
	db.booking.findAll({ 
		where: {
			created: {
				$between: [daterange.start, daterange.end]
			}
		}
	}).then((thebookings)=>{
		var bookings=[]
			// store all bookings in array
			for (var i = 0; i < thebookings.length; i++) {
				bookings.push(thebookings[i].id)
			}
			report.bookings = bookings.length
			var bookers = []
			// store all bookers in array.
			for (var i = 0; i < thebookings.length; i++) {
				if (bookers.indexOf(thebookings[i].booker_id) == -1){
					bookers.push(thebookings[i].booker_id) 
				}
			}
			report.bookers = bookers.length
			// find all bookingitems that match with booking IDs from array.
			db.bookingitem.findAll({
				where: {
					booking_id: bookings
				}
			}).then((bookingitems)=>{
				revenue = 0
				for (var i = 0; i < bookingitems.length; i++) {
					revenue += bookingitems[i].locked_total_price
				}
			// add revenue to report object
			report.revenue="€ " + Number((revenue).toFixed(2))
			// add average revenue per booking to object
			report.averageRevenue="€ " + Number((revenue / report.bookings).toFixed(2))
			// profit calculation
			profit = (revenue * commission)
			// add profit to report object
			report.profit = "€ " + Number((profit).toFixed(2))
			// add average profit per booking to object
			report.averageProfit="€ " + Number( profit / report.bookings).toFixed(2)
			console.log(report)
			res.render('index',{
				report: report
			})
		})
		})
});


var server = app.listen(3000, function (){
	console.log ('listening on: ' + server.address().port)
});