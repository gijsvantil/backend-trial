const express = require('express');
const Sequelize = require('sequelize');

const app = express();

app.use(express.static('public'));

const sequelize = new Sequelize ('awesome', 'root', "", {
	host: 'localhost',
	dialect: 'sqlite',
	storage: './resources/awesome.sql',
	define: {
		timestamps: false
	}
})

const venue = sequelize.define('venue', {
	timestamps: false,
	name:{type: Sequelize.STRING, allowNull: false}
})
const item = sequelize.define('item', {
	timestamps: false,
	venue_id: {type: Sequelize.INTEGER, allowNull: false},
	name:{type: Sequelize.STRING, allowNull: false}
})
const space = sequelize.define('space', {
	timestamps: false,
	item_id: {type: Sequelize.INTEGER, allowNull: false},
	hour_price: {type: Sequelize.REAL, allowNull: false},
})
const product= sequelize.define('product', {
	timestamps: false,
	item_id: {type: Sequelize.INTEGER, allowNull: false},
	price: {type: Sequelize.REAL, allowNull: false}
})
const user = sequelize.define('user', {
	timestamps: false,
	first_name: {type: Sequelize.STRING, allowNull: false},
	last_name: {type: Sequelize.STRING, allowNull: false},
	registered: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
	email: {type: Sequelize.STRING, allowNull: false},
});
const booker = sequelize.define('booker', {
	timestamps: false,
	user_id: {type: Sequelize.INTEGER, allowNull: false},
	created: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
});

const booking = sequelize.define('booking', {
	timestamps: false,
	booker_id: {type: Sequelize.INTEGER, allowNull: false,},
	created: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
});

const bookingitem = sequelize.define('bookingitem', {
	timestamps: false,
	booking_id: {type: Sequelize.INTEGER, allowNull: false,},
	item_id: {type: Sequelize.INTEGER, allowNull: false,},
	quantity: {type: Sequelize.INTEGER, allowNull: false,},
	locked_piece_price: {type: Sequelize.REAL, allowNull: false},
	locked_total_price: {type: Sequelize.REAL, allowNull: false},
	start_timestamp: {type: Sequelize.INTEGER, allowNull: true},
	end_timestamp: {type: Sequelize.INTEGER, allowNull: true}
});

// venue.hasMany(item, {foreignKey: 'venue_id'})
item.belongsTo(venue, {foreignKey: 'venue_id'})

// item.hasMany(space, {foreignKey: 'item_id'})
space.belongsTo(item, {foreignKey: 'item_id'})

// item.hasMany(product, {foreignKey: 'item_id'})
product.belongsTo(item, {foreignKey: 'item_id'})

// user.hasMany(booker, {foreignKey:'user_id'})
booker.belongsTo(user, {foreignKey: 'user_id'})

// booker.hasMany(booking, {foreignKey:'booker_id'})
booking.belongsTo(booker, {foreignKey:'booker_id'} )

// booking.hasMany(bookingitem, {foreignKey:'booking_id'})
bookingitem.belongsTo(booking, {foreignKey:'bookingitem_id'})
// item.hasMany(bookingitem, {foreignKey:'item_id'})
bookingitem.belongsTo(item, {foreignKey:'item_id'})


app.get('/', (req, res) => {
	user.findAll({
		where: {
			first_name: "First6"
		}
	}).then((result)=>{
		console.log(result)
		res.send(result)
	})
});

sequelize.sync({force: false}).then(function () {
	var server = app.listen(3000, function (){
		console.log ('LTV report listening on: ' + server.address().port)
	});
});