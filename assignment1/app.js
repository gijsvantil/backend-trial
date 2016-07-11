const express = require('express');
const Sequelize = require('sequelize');
const Promise = require('promise');
const moment = require('moment');
const db = require('./db/database')

const app = express();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');


// function to select begin and endstamp from month
function getMonthDateRange(year, month) {
	var moment = require('moment');
// month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
// array is 'year', 'month', 'day', etc
var startDate = moment([year, month]).add(-1,"month");
var endDate = moment(startDate).endOf('month');
return { start: Math.floor(startDate / 1e3), end: Math.floor(endDate / 1e3) };
}
getMonthDateRange(2013,09)


let commission = 0.1

// // GET that listens on '/' and renders the report landing page
// app.get('/', (req, res)=>{
// 	res.render('index')
// })

// MONTHLY REPORTS
app.get('/', (req, res) => {

let report = {
	month: "",
	bookings: 0,
	bookers: 0,
	revenue: 0,
	profit: 0,
	averageRevenue: 0,
	averageProfit: 0
}
	// find all bookings in a specific month
	db.booking.findAll({ 
		where: {
			created: {
				$between: [1375308000, 1377986399]
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