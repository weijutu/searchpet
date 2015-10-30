var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var fs = require('fs');
var path = require('path'); 

function picture(p){
	this.p_id = p.p_id;
	this.photo = p.photo;
}

//取得照片  ok
picture.prototype.getPictures = function(callback){
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
	    	callback(err, result);
	    });
	});
};

picture.prototype.getEntityById = function(p_id, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from picture where p_id=:p_id", 
	    	{ p_id: p_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	console.log('[picture] result.rows:', result.rows);
	    	callback(err, result.rows);
	    });
	});
};
picture.prototype.read = function(p_id, callback){
	console.log('p_id:', p_id);

	try {
		oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
        function(err, connection){
          console.log('insert image error :', err);
            if (err) {
                return cb(err);
            }
      		connection.execute(
				  "SELECT * FROM picture WHERE p_id = :p_id",
				  { p_id: p_id },
				  function(err, result) {
				  	console.log('read err:', err);
				  	console.log('read result:', result);
				    if (err) { console.error(err.message); return; }
				    if (result.rows.length === 0) { console.log("No results"); return; }

				    var lob = result.rows[0][1];
				    // console.log('lob:', lob);
				    if (lob === null) { console.log("BLOB was NULL"); return; }

				    // lob.setEncoding('utf8');  // we want text, not binary output
				    lob.on('error', function(err) { console.error(err); });

				    console.log('Writing to ' + outFileName);
				    var outFileName = './images/blobstreamout.jpg';
				    var outStream = fs.createWriteStream(outFileName);
				    outStream.on('error', function(err) { console.error(err); });
				    lob.pipe(outStream);

				    callback(err, result);
			});
        }
    );

		
	} catch(e) {
		console.log(e);
	}
	
};

picture.prototype.insert = function(user, cb){
	try {
		var inFileName = './images/abc.jpg';
	    console.log('Reading from ' + inFileName);
	    var inStream2 = fs.createReadStream(inFileName);
	    // console.log('inStream2:', inStream2);
	    console.log('fs.statSync(filePath).isFile():', fs.statSync(inFileName).isFile());
	} catch (e) {
		console.log('e:', e);
	}
	

	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
        function(err, connection){
          console.log('insert image error :', err);
            if (err) {
                return cb(err);
            }
      		connection.execute(
			  "INSERT INTO picture (p_id, photo) VALUES (:p_id, EMPTY_BLOB()) RETURNING photo INTO :lobbv",
			  { p_id: 'e043b666-de30-46a2-8ae0-bd7aef1f1ece', lobbv: {type: oracledb.BLOB, dir: oracledb.BIND_OUT} },
			  { autoCommit: false },  // a transaction needs to span the INSERT and pipe()
			  function(err, result)
			  {
			    if (err) { console.error(err.message); return; }
			    if (result.rowsAffected != 1 || result.outBinds.lobbv.length != 1) {
			      console.error('Error getting a LOB locator');
			      return;
			    }

			    var lob = result.outBinds.lobbv[0];
			    lob.on('error', function(err) { console.error(err); });

			    var inFileName = './images/abc.jpg';
			    console.log('Reading from ' + inFileName);
			    var inStream = fs.createReadStream(inFileName);
			    inStream.on('end', function() {
                  connection.commit(
                    function(err) {
                      if (err)
                        console.error(err.message);
                      else
                        console.log("Text inserted successfully.");
                    });
                });
			    inStream.on('error', function(err) { console.error(err); });
			    inStream.pipe(lob);  // copies the text to the CLOB
			    cb(err, result);
			  });
          	
        }
    );
};

module.exports = picture;