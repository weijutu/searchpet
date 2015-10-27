var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

//INSERT INTO "GROUP8"."OPFN" (R_ID, OPFN) VALUES ('437643b0-ac9e-41bc-abd1-3706b0642000', 'sdfb')
//UPDATE "GROUP8"."OPFN" SET OPFN = 'sawr' WHERE ROWID = 'AAAWecAABAAAICxAAA' AND ORA_ROWSCN = '2909928'

function opfn(o){
	this.r_id = o.r_id;
	this.opfn = o.opfn;
}

//ok
opfn.prototype.getEntityById = function(r_id){
	console.log('r_id:', r_id);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message); return;  }
	    connection.execute("select * from opfn where r_id=:r_id", 
	    	{ r_id: r_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('[opfn getEntityById] result:', result);
	    	console.log('=============');
	    	console.log('result.rows:', result.rows);
	    });
	});
};

module.exports = opfn;