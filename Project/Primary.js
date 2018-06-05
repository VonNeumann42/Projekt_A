const express = require ('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database.db', (error) => {
	if (error){
		console.log(error.message);
	}
});

const session = require("express-session");
app.use(session({
	secret: "example",
	resave: false,
	saveUnitialized: true
}));

const port = 3000;
app.listen(port, function () {
	console.log('affirmative')
});

app.get('/', (req, res) => {
	let sql1 = `SELECT id FROM user WHERE id=0`;
	db.get(sql1,(error, data) => {
		if(error){
			console.log('created');
			db.run(`CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, password TEXT NOT NULL)`);
			db.run(`CREATE TABLE attributes(id INTEGER PRIMARY KEY AUTOINCREMENT, str INTEGER NOT NULL, dex INTEGER NOT NULL, con INTEGER NOT NULL, int INTEGER NOT NULL, wis INTEGER NOT NULL, cha INTEGER NOT NULL)`);
			db.run(`CREATE TABLE combatValues(id INTEGER PRIMARY KEY AUTOINCREMENT, atk INTEGER NOT NULL, ac INTEGER NOT NULL, cs INTEGER NOT NULL, sr INTEGER NOT NULL, foc INTEGER NOT NULL, co INTEGER NOT NULL)`);
			db.run(`CREATE TABLE status(id INTEGER PRIMARY KEY AUTOINCREMENT, hpmax INTEGER NOT NULL, hpcurrent INTEGER NOT NULL, hpdice INTEGER NOT NULL, mpmax INTEGER NOT NULL, mpcurrent INTEGER NOT NULL, mpdice INTEGER NOT NULL, bpmax INTEGER NOT NULL, bpcurrent INTEGER NOT NULL, bpdice INTEGER NOT NULL)`);
			db.run(`CREATE TABLE background(id INTEGER PRIMARY KEY AUTOINCREMENT, focus TEXT, class TEXT, alignment TEXT, background TEXT)`);
			db.run(`CREATE TABLE weapons(id INTEGER PRIMARY KEY AUTOINCREMENT, weapon1 TEXT, damage1 TEXT, crit1 TEXT, special1 TEXT, weapon2 TEXT, damage2 TEXT, crit2 TEXT, special2 TEXT, weapon3 TEXT, damage3 TEXT, crit3 TEXT, special3 TEXT)`);
			db.run(`CREATE TABLE feats(id INTEGER PRIMARY KEY AUTOINCREMENT, owner INTEGER NOT NULL, name TEXT, description TEXT)`);
			db.run(`CREATE TABLE items(id INTEGER PRIMARY KEY AUTOINCREMENT, owner INTEGER NOT NULL, name TEXT, description TEXT)`);
		}
	})
	res.render('Start', {});
});

app.post('/login', (req, res) =>{
	const user = req.body['name']
	let sq1 = `SELECT id FROM user WHERE name = '${user}'`
	db.get(sq1, function(err, row){
		req.session["CurrentUser"] = row.id;
		console.log("The users ID is:" + req.session["CurrentUser"]);
	})
	
	const passwordInput = req.body['password']
	let sq2 = `SELECT password FROM user WHERE name = '${user}'`;
	db.get(sq2, function(err, row){
		let login = row;	
		if(passwordInput === login.password){
			res.redirect('/start')
		} else{
			res.redirect('/');
		}
	})
		
	
})


app.post('/register', (req, res) =>{
	let name = req.body['name']
	let passwordInput = req.body['password']
	let used = 0
	let sq2 = `SELECT name FROM user`;
	db.all(sq2, function(err, row){
		for(let i = 0; i < row.length; i ++){
			if(name === row[i].name){
				used = 1;
			}
		}
		if(used == 0){
			const sql = `INSERT INTO user (name, password) VALUES ('${name}', '${passwordInput}')`;
			db.run(sql);
			let sq2 = `SELECT id FROM user WHERE name = '${name}'`;
			db.get(sq2, function(err, row){
				const newProfile = row.id;
				let construct = `INSERT INTO attributes (str, dex, con, int, wis, cha) VALUES (10,10,10,10,10,10)`;
				db.run(construct);
				construct = `INSERT INTO combatValues (atk, ac, cs, sr, foc, co) VALUES (0,0,0,0,0,0)`;
				db.run(construct);
				construct = `INSERT INTO status (hpmax, hpcurrent, hpdice, mpmax, mpcurrent, mpdice, bpmax, bpcurrent, bpdice) VALUES (7,4,2,9,2,2,0,4,2)`;
				db.run(construct);
				construct = `INSERT INTO background (focus, class, alignment, background) VALUES ('Physical, Mental, Soul','Adventurer','Chaotic Evil','Laaaaaaaaanger text')`;
				db.run(construct);
				construct = `INSERT INTO weapons (weapon1, damage1, crit1, special1, weapon2, damage2, crit2, special2, weapon3, damage3, crit3, special3) VALUES ('shortsword','D6','19/2','deals slashing damage','dagger','D4','20/3','can deal slashing or piercing damage','0','0','0','0')`;
				db.run(construct);
				construct = `INSERT INTO feats (owner, name, description) VALUES (${newProfile},'basic spellcasting','Use level one and two spells without penalty')`;
				db.run(construct);
				construct = `INSERT INTO items (owner, name, description) VALUES (${newProfile},'gold coin','a common currency accepted within most human nations')`;
				db.run(construct);
			})
			
			
		}
	})
	
	res.redirect('/');
})

app.get('/create', (req, res) => {
	res.render('Register', {});
})

app.get('/start', (req, res) => {
	console.log(req.session["CurrentUser"]);
	console.log("Logged in")
	const user = req.session["CurrentUser"];
	res.redirect('toAbilities');
			
})





//___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________





app.post('/fromAttributes/:id', (req, res) =>{
	const user = req.session["CurrentUser"];
	const id = req.params['id'];
	console.log('The ID is:')
	console.log(id);
	
	let str = req.body['str'];
	db.run(`update attributes set str = '${str}' where id = '${user}'`);
	let dex = req.body['dex'];
	db.run(`update attributes set dex = '${dex}' where id = '${user}'`);
	let con = req.body['con'];
	db.run(`update attributes set con = '${con}' where id = '${user}'`);
	let inte = req.body['int'];
	db.run(`update attributes set int = '${inte}' where id = '${user}'`);
	let wis = req.body['wis'];
	db.run(`update attributes set wis = '${wis}' where id = '${user}'`);
	let cha = req.body['cha'];
	db.run(`update attributes set cha = '${cha}' where id = '${user}'`);
	
	let atk = req.body['atk'];
	db.run(`update combatValues set atk = '${atk}' where id = '${user}'`);
	let ac = req.body['ac'];
	db.run(`update combatValues set ac = '${ac}' where id = '${user}'`);
	let cs = req.body['cs'];
	db.run(`update combatValues set cs = '${cs}' where id = '${user}'`);
	let sr = req.body['sr'];
	db.run(`update combatValues set sr = '${sr}' where id = '${user}'`);
	let foc = req.body['foc'];
	db.run(`update combatValues set foc = '${foc}' where id = '${user}'`);
	let co = req.body['co'];
	db.run(`update combatValues set co = '${co}' where id = '${user}'`);
	
	let hpmax = req.body['hpmax'];
	db.run(`update status set hpmax = '${hpmax}' where id = '${user}'`);
	let hpcurrent = req.body['hpcurrent'];
	db.run(`update status set hpcurrent = '${hpcurrent}' where id = '${user}'`);
	let hpdice = req.body['hpdice'];
	db.run(`update status set hpdice = '${hpdice}' where id = '${user}'`);
	let mpmax = req.body['mpmax'];
	db.run(`update status set mpmax = '${mpmax}' where id = '${user}'`);
	let mpcurrent = req.body['mpcurrent'];
	db.run(`update status set mpcurrent = '${mpcurrent}' where id = '${user}'`);
	let mpdice = req.body['mpdice'];
	db.run(`update status set mpdice = '${mpdice}' where id = '${user}'`);
	let bpmax = req.body['bpmax'];
	db.run(`update status set bpmax = '${bpmax}' where id = '${user}'`);
	let bpcurrent = req.body['bpcurrent'];
	db.run(`update status set bpcurrent = '${bpcurrent}' where id = '${user}'`);
	let bpdice = req.body['bpdice'];
	db.run(`update status set bpdice = '${bpdice}' where id = '${user}'`);

if (id == 1) {
		res.redirect('/toAttributes');
	} else if (id == 2) {
		res.redirect('/toAbilities');
	} else if (id == 3) {
		res.redirect('/toInventory');
	} else if (id == 4) {
		res.redirect('/toBackground');
	}


})

app.post('/fromBackground/:id', (req, res) =>{
	const user = req.session["CurrentUser"];
	const id = req.params['id'];

	let focuss = req.body['focuss'];
	db.run(`update background set focus = '${focuss}' where id = '${user}'`);
	let classs = req.body['classs'];
	db.run(`update background set class = '${classs}' where id = '${user}'`);
	let alignment = req.body['alignment'];
	db.run(`update background set alignment = '${alignment}' where id = '${user}'`);
	let background = req.body['background'];
	db.run(`update background set background = '${background}' where id = '${user}'`);
	
if (id == 1) {
		res.redirect('/toAttributes');
	} else if (id == 2) {
		res.redirect('/toAbilities');
	} else if (id == 3) {
		res.redirect('/toInventory');
	} else if (id == 4) {
		res.redirect('/toBackground');
	}
	
	
})

app.post('/fromAbilities/:id', (req, res) =>{
	const user = req.session["CurrentUser"];
	let id = req.params['id'];
	console.log('The ID is:')
	console.log(id);
	let feat = '';
	let idc = 0;
	let description = '';
	
	let iterator = req.body['length'];
	console.log(iterator);
	console.log(req.body['id']);
	
	
	for(i = 0; i < iterator; i++){
		idc = req.body['id' + i];
		console.log("the Id is:" + idc);
		feat = req.body['name' + i];
		console.log("the name is" + feat);
		description = req.body['description' + i];
		console.log("description" + description);
		db.run(`update feats set name = '${feat}' where id = '${idc}'`);
		db.run(`update feats set description = '${description}' where id = '${idc}'`);
	}
	
	
	if(id == 0){
		let construct = `INSERT INTO feats (owner, name, description) VALUES ('${user}','name of the ability','Description')`;
		db.run(construct);
		res.redirect('/toAbilities');
	} else if (id == 1) {
		res.redirect('/toAttributes');
	} else if (id == 2) {
		res.redirect('/toAbilities');
	} else if (id == 3) {
		res.redirect('/toInventory');
	} else if (id == 4) {
		res.redirect('/toBackground');
	} else {
		id -= 5
		db.run(`DELETE FROM feats WHERE id = '${id}'`);
		res.redirect('/toAbilities');
	}


})

app.post('/fromInventory/:id', (req, res) =>{
	const user = req.session["CurrentUser"];
	let id = req.params['id'];
	
	let name = '';
	let idc = 0;
	let description = '';
	
	let iterator = 0;
	for(let entry in req.body){
			if(iterator == 12){
				idc = req.body[entry];
				iterator = 13;
			}
			if(iterator == 13){
				name = req.body[entry];
				iterator = 14;
			}
			if(iterator == 14){
				description = req.body[entry];
				iterator = 11;
				db.run(`update items set name = '${name}' where id = '${idc}'`);
				db.run(`update items set description = '${description}' where id = '${id}'`);
			}
			if(iterator == 0){
				let current = req.body[entry];
				db.run(`update weapons set weapon1 = '${current}' where id = '${user}'`);
			}
			if(iterator == 1){
				let current = req.body[entry];
				db.run(`update weapons set damage1 = '${current}' where id = '${user}'`);
			}
			if(iterator == 2){
				let current = req.body[entry];
				db.run(`update weapons set crit1 = '${current}' where id = '${user}'`);
			}
			if(iterator == 3){
				let current = req.body[entry];
				db.run(`update weapons set special1 = '${current}' where id = '${user}'`);
			}
			if(iterator == 4){
				let current = req.body[entry];
				db.run(`update weapons set weapon2 = '${current}' where id = '${user}'`);
			}
			if(iterator == 5){
				let current = req.body[entry];
				db.run(`update weapons set damage2 = '${current}' where id = '${user}'`);
			}
			if(iterator == 6){
				let current = req.body[entry];
				db.run(`update weapons set crit2 = '${current}' where id = '${user}'`);
			}
			if(iterator == 7){
				let current = req.body[entry];
				db.run(`update weapons set special2 = '${current}' where id = '${user}'`);
			}
			if(iterator == 8){
				let current = req.body[entry];
				db.run(`update weapons set weapon3 = '${current}' where id = '${user}'`);
			}
			if(iterator == 9){
				let current = req.body[entry];
				db.run(`update weapons set damage3 = '${current}' where id = '${user}'`);
			}
			if(iterator == 10){
				let current = req.body[entry];
				db.run(`update weapons set crit3 = '${current}' where id = '${user}'`);
			}
			if(iterator == 11){
				let current = req.body[entry];
				db.run(`update weapons set special3 = '${current}' where id = '${user}'`);
			}
		iterator ++;
	}
	
if(id == 0){
		let construct = `INSERT INTO items (owner, name, description) VALUES ('${user}','name of the ability','Description')`;
		db.run(construct);
		res.redirect('/toInventory');
	} else if (id == 1) {
		res.redirect('/toAttributes');
	} else if (id == 2) {
		res.redirect('/toAbilities');
	} else if (id == 3) {
		res.redirect('/toInventory');
	} else if (id == 4) {
		res.redirect('/toBackground');
	} else {
		id -= 5
		db.run(`DELETE FROM items WHERE id = '${id}'`);
		res.redirect('/toInventory');
	}



})

app.get('/toAttributes', (req, res) => {
	console.log("arrived at toAttributes");
	const user = (req.session["CurrentUser"]);
	console.log(user);
	db.get(`SELECT str FROM attributes WHERE id = '${user}'`, function(err, row){
		console.log(row);
		console.log(row.str);
		let str = row.str;
		console.log(str);
	
		db.get(`SELECT dex FROM attributes WHERE id = '${user}'`, function(err, row){
			let dex = row.dex;
			db.get(`SELECT con FROM attributes WHERE id = '${user}'`, function(err, row){
				let con = row.con;
				db.get(`SELECT int FROM attributes WHERE id = '${user}'`, function(err, row){
					let inte = row.int;
					db.get(`SELECT wis FROM attributes WHERE id = '${user}'`, function(err, row){
						let wis = row.wis;
						db.get(`SELECT cha FROM attributes WHERE id = '${user}'`, function(err, row){
							let cha = row.cha;
							db.get(`SELECT atk FROM combatValues WHERE id = '${user}'`, function(err, row){
								let atk = row.atk;
								db.get(`SELECT ac FROM combatValues WHERE id = '${user}'`, function(err, row){
									let ac = row.ac;
									db.get(`SELECT cs FROM combatValues WHERE id = '${user}'`, function(err, row){
										let cs = row.cs;
										db.get(`SELECT sr FROM combatValues WHERE id = '${user}'`, function(err, row){
											let sr = row.sr;
											db.get(`SELECT foc FROM combatValues WHERE id = '${user}'`, function(err, row){
												let foc = row.foc;
												db.get(`SELECT co FROM combatValues WHERE id = '${user}'`, function(err, row){
													let co = row.co;
													db.get(`SELECT hpmax FROM status WHERE id = '${user}'`, function(err, row){
														let hpmax = row.hpmax;
														db.get(`SELECT hpcurrent FROM status WHERE id = '${user}'`, function(err, row){
															let hpcurrent = row.hpcurrent;
															db.get(`SELECT hpdice FROM status WHERE id = '${user}'`, function(err, row){
																let hpdice = row.hpdice;
																db.get(`SELECT mpmax FROM status WHERE id = '${user}'`, function(err, row){
																	let mpmax = row.mpmax;
																	db.get(`SELECT mpcurrent FROM status WHERE id = '${user}'`, function(err, row){
																		let mpcurrent = row.mpcurrent;
																		db.get(`SELECT mpdice FROM status WHERE id = '${user}'`, function(err, row){
																			let mpdice = row.mpdice;
																			db.get(`SELECT bpmax FROM status WHERE id = '${user}'`, function(err, row){
																				let bpmax = row.bpmax;
																				db.get(`SELECT bpcurrent FROM status WHERE id = '${user}'`, function(err, row){
																					let bpcurrent = row.bpcurrent;
																					db.get(`SELECT bpdice FROM status WHERE id = '${user}'`, function(err, row){
																						let bpdice = row.bpdice;
		
																						res.render(	'attributes',
																								{'str': str,
																								'dex': dex,
																								'con': con,
																								'inte': inte,
																								'wis': wis,
																								'cha': cha,
																								
																								'atk': atk,
																								'ac': ac,
																								'cs': cs,
																								'sr': sr,
																								'foc': foc,
																								'co': co,
																								
																								'hpmax': hpmax,
																								'hpcurrent': hpcurrent,
																								'hpdice': hpdice,
																								'mpmax': mpmax,
																								'mpcurrent': mpcurrent,
																								'mpdice': mpdice,
																								'bpmax': bpmax,
																								'bpcurrent': bpcurrent,
																								'bpdice': bpdice});
																					})
																				})
																			})
																		})
																	})
																})
															})
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	})
	
	
	
	
	
	
	
	
	console.log("Attributes acquired")

})

app.get('/toBackground',  (req, res) => {
	console.log("reached Background");
	const user = req.session["CurrentUser"];
	console.log(user)
	db.get(`SELECT focus FROM background WHERE id = '${user}'`, function(err, row){
		console.log(row.focus);
		let focuss = "" + row.focus;
		db.get(`SELECT class FROM background WHERE id = '${user}'`, function(err, row){
			let classs = "" + row.class;
			db.get(`SELECT alignment FROM background WHERE id = '${user}'`, function(err, row){
				let alignment = "" + row.alignment;
				db.get(`SELECT background FROM background WHERE id = '${user}'`, function(err, row){
					let background = "" + row.background;
					res.render(	'background', 
						{'focuss': focuss,
						'classs': classs,
						'alignment': alignment,
						'background': background
						}
					)
				})
			})
		})
	})
	
	
	
	
	
	
	
	
})


app.get('/toAbilities',  (req, res) => {
	const user = req.session["CurrentUser"];
	
	db.all(`Select id FROM feats WHERE owner = '${user}'`, function(err, row){
		let id = row;
		db.all(`Select name FROM feats WHERE owner = '${user}'`, function(err, row){
			let abilities = row;
			db.all(`Select description FROM feats WHERE owner = '${user}'`, function(err, row){
				let description = row;
				res.render('abilities',{'abilities': abilities,
										'id': id,
										'description': description});
			})
		})
	})
	
	
	
	
})

app.get('/toInventory',  (req, res) => {
	const user = req.session["CurrentUser"];
	
	
	db.get(`SELECT weapon1 FROM weapons WHERE id = '${user}'`, function(err, row){
		let weapon1 = row.weapon1;
		db.get(`SELECT damage1 FROM weapons WHERE id = '${user}'`, function(err, row){
			let damage1 = row.damage1;
			db.get(`SELECT crit1 FROM weapons WHERE id = '${user}'`, function(err, row){
				let crit1 = row.crit1;
				db.get(`SELECT special1 FROM weapons WHERE id = '${user}'`, function(err, row){
					let special1 = row.special1;
					db.get(`SELECT weapon2 FROM weapons WHERE id = '${user}'`, function(err, row){
						let weapon2 = row.weapon2;
						db.get(`SELECT damage2 FROM weapons WHERE id = '${user}'`, function(err, row){
							let damage2 = row.damage2;
							db.get(`SELECT crit2 FROM weapons WHERE id = '${user}'`, function(err, row){
								let crit2 = row.crit2;
								db.get(`SELECT special2 FROM weapons WHERE id = '${user}'`, function(err, row){
									let special2 = row.special2;
									db.get(`SELECT weapon3 FROM weapons WHERE id = '${user}'`, function(err, row){
										let weapon3 = row.weapon3;
										db.get(`SELECT damage3 FROM weapons WHERE id = '${user}'`, function(err, row){
											let damage3 = row.damage3;
											db.get(`SELECT crit3 FROM weapons WHERE id = '${user}'`, function(err, row){
												let crit3 = row.crit3;
												db.get(`SELECT special3 FROM weapons WHERE id = '${user}'`, function(err, row){
													let special3 = row.special3;
														db.all(`Select name FROM items WHERE owner = '${user}'`, function(err, row){
														let equipment = row;
														db.all(`Select id FROM items WHERE owner = '${user}'`, function(err, row){
															let id = row;
															db.all(`Select description FROM items WHERE owner = '${user}'`, function(err, row){
																let description = row;
																res.render('inventory',{'equipment': equipment,
																						'description': description, 
																						'id': id,
																						'weapon1': weapon1,
																						'damage1': damage1,
																						'crit1': crit1,
																						'special1': special1,
																						'weapon2': weapon2,
																						'damage2': damage2,
																						'crit2': crit2,
																						'special2': special2,
																						'weapon3': weapon3,
																						'damage3': damage3,
																						'crit3': crit3,
																						'special3': special3});
															})	
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	})
	

	
	

	
	
	
	
})

