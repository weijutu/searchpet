var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

function member_role(m){
	this.m_id = m.m_id;
	this.r_id = m.r_id;
	this.account = m.account;
	this.password = m.password;
	this.name = m.name;
	this.email = m.email;
	this.telphone = m.telphone;
	this.r_name = m.r_name;
}

member_role.prototype.getMembersAndRole = function(callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select m.*, r.r_name from Member m, Role r where m.r_id = r.r_id", 
	    	{}, 
	    	{ outFormat: oracledb.OBJECT }, 
	    	function(err, result){
	    		if (err) {
		    		console.error(err.message);
		    		return;
		    	}
		    	// console.log('result.rows:', result.rows);
	    		// console.log('member [getMembers] result:', result);
	    		callback(err, result);
	    	}
	    );
	});
};

module.exports = member_role;