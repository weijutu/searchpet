var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

function office(o){
	this.o_id = o.o_id;
	this.r_id = o.r_id;
	this.name = o.name;
	this.telphone = o.telphone;
	this.address = o.address;
	this.email = o.email;
}


//取得所有會員  ok
office.prototype.getOffices = function(){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  return; }
	    connection.execute("select * from office", {}, { outFormat: oracledb.OBJECT },function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('result.rows:', result.rows);
	    	console.log('office [getOffice] result:', result);
	    });
	});
};

//透過機關構編號取得資料 ok
office.prototype.getEntityById = function(o_id){
	console.log('o_id:', o_id);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message); return;  }
	    connection.execute("select * from office where o_id=:o_id", 
	    	{ o_id: o_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('[office getEntityById] result:', result);
	    	console.log('=============');
	    	console.log('result.rows:', result.rows);
	    	// fetchRowsFromRS(connection, result.outBinds.cursor, numRows);
	    });
	});
};

module.exports = office;