var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

//INSERT INTO "GROUP8"."COMPONENT" (P_ID, COMP_TYPE, COMP_COLOR, COMP_REMARK, DESCRIPTION) VALUES ('e043b666-de30-46a2-8ae0-bd7aef1f1ece', 'abc', 'qwe', 'asdf', 'zxcv')
//UPDATE "GROUP8"."COMPONENT" SET COMP_TYPE = 'abc1' WHERE ROWID = 'AAAWetAABAAAIChAAA' AND ORA_ROWSCN = '2909573'
function component(c){
	this.p_id = c.p_id;
	this.comp_type = c.comp_type;
	this.comp_color = c.comp_color;
	this.comp_remark = c.comp_remark;
	this.description = c.description;
}

//透過配件編號取得資料
component.prototype.getEntityById = function(p_id, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from component where p_id=:p_id", 
	    	{ p_id: p_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('[component] result.rows:', result.rows);
	    	callback(err, result.rows);
	    });
	});
};

module.exports = component;