var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();

function picture(p){
	this.p_id = p.p_id;
	this.photo = p.photo;
}

//取得照片  ok
picture.prototype.getPictures = function(){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  return; }
	    connection.execute("select * from picture", {}, { outFormat: oracledb.OBJECT },function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('result.rows:', result.rows);
	    	console.log('office [getOffice] result:', result);
	    });
	});
};

picture.prototype.getEntityById = function(id){
	
};

module.exports = picture;