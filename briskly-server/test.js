//https://javascript.info/async-await

var db = require('./database_utils');
var data = require('./data');
var result = "";

//db.add_parent(data.parent_data_01);

child_data = data.child_data;
parent_data_01 = data.parent_data_01

nursery_search_name = {'name': "Park Street Childcare and Kindergarten",
						'city':['Brunswick'],
						'state':['Vic']};
nursery = {};
nursery_search = {'city':['Epping','Brunswick'],'state':['Vic','Vic'],
					'Language':'French',
					'Opening_Hours':['Weekdays','Statutory Holidays']};

setTimeout(db.close_db,200);

/*
response = db.find_nursery(nursery_search, function(err, nursery_search) {
	if (err) console.log(err);
	console.log(nursery_search);
});

//console.log(response);
*/


db.get_password({"email":"email@email.com"}, function(err, details) {
	if (err) {
		console.log(err);
	}

	console.log(details);
})

db.add_parent(data.parent_data_02, function(err, result) {
	if (err) {
		console.log(err);
	}

	console.log(result);
})

/*
db.add_parent(data.parent_data_02, function(err, parent_data_01) {
	if (err) {
		console.log(err);
	};

	console.log("Parent added");

	db.add_child(data.child_data, function(err) {
		if (err) throw err;

		console.log("Child Done");
		console.log(result);
		db.close_db(function(err) {
			if (err) {
				throw err;
			}
		});
	});
});
*/
//setTimeout(db.close_db,1000);
/*

db.add_nursery(nursery_data)
	.then(() => db.add_nursery(nursery_data01)
	.then(() => db.add_nursery(nursery_data02)
	.then(() => db.add_nursery(nursery_data03)
	.then(() => db.add_nursery(nursery_data04)
	.then(() => db.add_parent(data.parent_data_02)
	.then(() => db.add_parent(data.parent_data_01)))))))
	.then(() => result = db.get_password({"email":"email@email.com"}));

//db.update_password({"userId":1, "password":"FigityGibbet"});
//setTimeout(db.test_db,1000)
//db.add_child(child_data)
*/

console.log("Done");
console.log(result);

/*
nursery_data = data.nursery_data;

db.add_nursery(nursery_data, function(err, nursery_data) {
	if (err) throw err;
})

nursery_data01 = data.nursery_data01;

db.add_nursery(nursery_data01, function(err, nursery_data01) {
	if (err) throw err;
})

nursery_data02 = data.nursery_data02;

db.add_nursery(nursery_data02, function(err, nursery_data02) {
	if (err) throw err;
})

nursery_data03 = data.nursery_data03;

db.add_nursery(nursery_data03, function(err, nursery_data03) {
	if (err) throw err;
})

nursery_data04 = data.nursery_data04;

db.add_nursery(nursery_data04, function(err, nursery_data04) {
	if (err) throw err;
})
*/
//setTimeout(db.close_db,1000);
