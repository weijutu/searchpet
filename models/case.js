var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();


//INSERT INTO "GROUP8"."CASE" (P_ID, M_ID, O_ID, GENDER, VARIETY, COLOR, HASCHIP, DESCRIPTION, BACK_STATUS, OWNER_TELEPHONE, OWNER_NAME, PICKUPTIME, LOCATION) VALUES ('e043b666-de30-46a2-8ae0-bd7aef1f1ece', '431d9446-c170-4c3d-8403-85efe5d73c00', '3a564f04-7030-4bab-baa1-1120fe5e60d1', 'F', 'ABC', 'RED', '1', 'QQQQWWWW', '2', 'AABB', 'TTESSTT', TO_DATE('2015-10-23 18:33:47', 'YYYY-MM-DD HH24:MI:SS'), 'kao')
//UPDATE "GROUP8"."CASE" SET SHELTERTIME = TO_DATE('2015-10-08 18:35:13', 'YYYY-MM-DD HH24:MI:SS') WHERE ROWID = 'AAAWejAABAAAICRAAA' AND ORA_ROWSCN = '2909066'
function cases(c){
	this.p_id = c.p_id;
	this.m_id = c.m_id;
	this.o_id = c.o_id;
	this.gender = c.gender;
	this.variety = c.variety;
	this.color = c.color;
	this.haschip = c.haschip;
	this.description = c.description;
	this.back_status = c.back_status;
	this.owner_telephone = c.owner_telephone;	
	this.owner_name = c.owner_name;
	this.pickuptime = c.pickuptime;
	this.location = c.location;
	this.sheltertime = c.sheltertime;

	this.m_id_1 = c.m_id_1;
	this.r_id = c.r_id;
	this.account = c.account;
	this.password = c.password;
	this.name = c.name;
	this.email = c.email;
	this.telphone = c.telphone;
}

//取得 case 資料 ok
cases.prototype.getCases = function(callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  return; }
	    connection.execute("select * from case", {}, { outFormat: oracledb.OBJECT },function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('result.rows:', result.rows);
	    	callback(err, result.rows);
	    	// console.log('office [getOffice] result:', result);
	    });
	}); 
};

cases.prototype.getCasesAndMemberByCaseId = function(p_id, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  return; }  
	    connection.execute("select * from case c , member m where c.m_id = m.m_id and c.p_id = :p_id", 
	    	{ p_id: p_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    		console.log('[getCasesAndMemberByCaseId] result.err:', err);
		    	if (err) {
		    		console.error(err.message);
		    		return;
		    	}
		    	console.log('[getCasesAndMemberByCaseId] result.rows:', result.rows);
		    	callback(err, result.rows);
	    	// console.log('office [getOffice] result:', result);
	    });
	}); 
};

//透過案件編號取得資料
cases.prototype.getEntityById = function(p_id, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from case where p_id=:p_id", 
	    	{ p_id: p_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('result.rows:', result.rows);
	    	callback(err, result.rows);
	    	// console.log('[case getEntityById] result:', result);

	    	// fetchRowsFromRS(connection, result.outBinds.cursor, numRows);
	    });
	});
};

module.exports = cases;