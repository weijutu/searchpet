var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

//UPDATE "GROUP8"."MEMBER" SET R_ID = 'f865d0e9-e86f-4c3f-921c-734340d95567' WHERE ROWID = 'AAAWehAABAAAH1xAAA' AND ORA_ROWSCN = '2901385'
function member(m){
	this.m_id = m.m_id;
	this.r_id = m.r_id;
	this.account = m.account;
	this.password = m.password;
	this.name = m.name;
	this.email = m.email;
	this.telphone = m.telphone;
}

//取得所有會員
member.prototype.getMembers = function(){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from member", 
	    	{}, 
	    	{ outFormat: oracledb.OBJECT }, 
	    	function(err, result){
	    		if (err) {
		    		console.error(err.message);
		    		return;
		    	}
		    	console.log('result.rows:', result.rows);
	    		console.log('member [getMembers] result:', result);
	    	}
	    );
	});
};

//透過會員編號取得會員資料
member.prototype.getEntityById = function(m_id){
	console.log('m_id:', m_id);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from member where m_id=:m_id", 
	    	{ m_id: m_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('result.rows:', result.rows);
	    	console.log('[member getEntityById] result:', result);

	    	// fetchRowsFromRS(connection, result.outBinds.cursor, numRows);
	    });
	});
};

function fetchRowsFromRS(connection, resultSet, numRows) {
	console.log('[fetchRowsFromRS] resultSet:', resultSet);
	console.log('[fetchRowsFromRS] numRows:', numRows);
	resultSet.getRows(numRows, function(err, rows){
		if (err) {
			console.err(err);
		} else if (rows.length == 0) {
			console.err('rows length =0');
		} else if (rows.length > 0){
			console.log(rows);
        	fetchRowsFromRS(connection, resultSet, numRows);  // get next set of rows
		}
	});
}

module.exports = member;