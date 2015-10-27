var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

//INSERT INTO "GROUP8"."ROLE" (R_ID, R_NAME) VALUES ('njjj', 'poo')

function role(r){
	this.r_id = r.r_id;
	this.r_name = r.r_name;
}

//取得角色列表 ok
role.prototype.getRoles = function(){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from role", 
	    	{}, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	console.log('[getEntityById] result:', result);
	    });
	});
};

//透過編號取得角色資料 ok
role.prototype.getEntityById = function(id){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from role where r_id = :id", 
	    	{ id: id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	console.log('[getEntityById] result:', result);
	    });
	});
	
};

//新增角色資料
role.prototype.insertRoleById = function(callback){
	// oracledb.getConnection({
	//     user          : config.oracle.user, 
	//     password      : config.oracle.password,
	//     connectString : config.oracle.connectionstring
	//   },
	//   function(err, connection) {
	//   	console.log('connection:', connection);
	//   	var id = 'abcdfg';
	//   	var name = 'aaaa';
	//   	console.log(id, name);
	//     if (err) { console.error(err.message);  }
	// 	connection.execute("INSERT INTO ROLE (r_id, r_name) VALUES (:r_id, :r_name) ",
	// 	{ 
	// 		r_id: id, 
	// 		r_name: name
	// 	},
	// 	function(err, result) {
	// 		console.log('result:', result);
	// 		if (err) {
	// 	      	console.error(err.message);
	// 	      	return;
	// 		} else {
	// 			console.log('result.rows:', result.rows);
	// 	      	console.log("Rows inserted " + result.rowsAffected);
	// 		}
	// 	});
	// });

	console.log('generateJSON():', generateJSON());
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log('connection:', connection);
	  	var id = 'abcdfg';
	  	var name = 'aaaa';
	  	var data = { "id": id, "name": name };
        var s = JSON.stringify(data);
	  	console.log(id, name);
	    if (err) { console.error(err.message);  }
		connection.execute(
            'INSERT INTO role (' +
            '   r_id, ' +
            '   r_name ' +
            ') VALUES ( ' +
            '   :r_id, ' +
            '   :r_name ' +
            ')',
            { r_id: { val: 'req.body.FIRST_NAME' }, r_name: { val: 'abcd' } }, 
            // {  isAutoCommit: true },
            function(err, results) {
                if (err) {
                    return connection.release(function() {
                        next(err);
                    });
                }
                doRelease(connection);
 
      //           connection.release(function(err) {
      //               if (err) return next(err);
 					// callback('ok');
      //               // res.send('some response here');
      //           });
            }
        );
	});

};

function doRelease(connection){
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}

function generateJSON() {
  var data = {
    r_id: 'abcds',
    r_name: 'sdafasdfassfd'
  };
  return JSON.stringify(data);
}

module.exports = role;