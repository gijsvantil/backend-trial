// Container object
var db = {
	mod: {}
}

// Sequelize set up
const Sequelize = require('sequelize')
db.conn = new Sequelize ('awesome', 'root', "", {
	host: 'localhost',
	dialect: 'sqlite',
	storage: './resources/awesome.sql',
	define: {
		timestamps: false
	}
});

//Models
db.venue = db.conn.define('venue', {
	timestamps: false,
	name:{type: Sequelize.STRING, allowNull: false}
});
db.item = db.conn.define('item', {
	timestamps: false,
	venue_id: {type: Sequelize.INTEGER, allowNull: false},
	name:{type: Sequelize.STRING, allowNull: false}
});
db.space = db.conn.define('space', {
	timestamps: false,
	item_id: {type: Sequelize.INTEGER, allowNull: false},
	hour_price: {type: Sequelize.REAL, allowNull: false},
});
db.product= db.conn.define('product', {
	timestamps: false,
	item_id: {type: Sequelize.INTEGER, allowNull: false},
	price: {type: Sequelize.REAL, allowNull: false}
});
db.user = db.conn.define('user', {
	timestamps: false,
	first_name: {type: Sequelize.STRING, allowNull: false},
	last_name: {type: Sequelize.STRING, allowNull: false},
	registered: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
	email: {type: Sequelize.STRING, allowNull: false},
});
db.booker = db.conn.define('booker', {
	timestamps: false,
	user_id: {type: Sequelize.INTEGER, allowNull: false},
	created: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
});

db.booking = db.conn.define('booking', {
	timestamps: false,
	booker_id: {type: Sequelize.INTEGER, allowNull: false,},
	created: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
});

db.bookingitem = db.conn.define('bookingitem', {
	timestamps: false,
	booking_id: {type: Sequelize.INTEGER, allowNull: false,},
	item_id: {type: Sequelize.INTEGER, allowNull: false,},
	quantity: {type: Sequelize.INTEGER, allowNull: false,},
	locked_piece_price: {type: Sequelize.REAL, allowNull: false},
	locked_total_price: {type: Sequelize.REAL, allowNull: false},
	start_timestamp: {type: Sequelize.INTEGER, allowNull: true},
	end_timestamp: {type: Sequelize.INTEGER, allowNull: true}
});

// Relations
db.item.belongsTo(db.venue, {foreignKey: 'venue_id'})
db.space.belongsTo(db.item, {foreignKey: 'item_id'})
db.product.belongsTo(db.item, {foreignKey: 'item_id'})
db.booker.belongsTo(db.user, {foreignKey: 'user_id'})
db.booking.belongsTo(db.booker, {foreignKey:'booker_id'} )
db.booking.hasMany(db.bookingitem)
db.bookingitem.belongsTo(db.booking, {foreignKey:'bookingitem_id'})
db.bookingitem.belongsTo(db.item, {foreignKey:'item_id'})


db.conn.sync( {'force': false} ).then( 
	() => { 
		console.log ( 'Sync succeeded' )
	},
	( err ) => { console.log('sync failed: ' + err) } 
	)

module.exports = db
