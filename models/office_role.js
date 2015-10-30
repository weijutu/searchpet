var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

function office_role(o){
	this.o_id = o.o_id;
	this.r_id = o.r_id;
	this.name = o.name;
	this.telphone = o.telphone;
	this.address = o.address;
	this.email = o.email;
	this.r_name = o.r_name;
}

office_role.prototype.getOfficesAndRole = function(callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select o.*, r.r_name from Office o, Role r where o.r_id = r.r_id", 
	    	{}, 
	    	{ outFormat: oracledb.OBJECT }, 
	    	function(err, result){
	    		if (err) {
		    		console.error(err.message);
		    		return;
		    	}
		    	console.log('result.rows:', result.rows);
	    		console.log('[getOfficesAndRole] result:', result);
	    		callback(err, result);
	    	}
	    );
	});
};

office_role.prototype.getOfficesAndRoleByOid = function(oid, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select o.*, r.r_name from Office o, Role r where o.r_id = r.r_id and o_id=:o_id", 
	    	{ o_id: oid }, 
	    	{ outFormat: oracledb.OBJECT }, 
	    	function(err, result){
	    		if (err) {
		    		console.error(err.message);
		    		return;
		    	}
		    	// console.log('result.rows:', result.rows);
	    		console.log('[getOfficesAndRoleByOid] result:', result);
	    		callback(err, result);
	    	}
	    );
	});
};

module.exports = office_role;