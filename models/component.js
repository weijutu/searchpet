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

component.prototype.update = function(entity, callback){
	console.log('entity update:', entity);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
        function(err, connection){
          	console.log('component update error :', err);
            if (err) {
                return callback(err);
            }
     		
          	connection.execute(
              "UPDATE component SET " + 
              "		comp_type = :comp_type, " +
              " 	comp_color = :comp_color, " +
              " 	comp_remark = :comp_remark, " + 
              " 	description=:description " + 
              " WHERE p_id = :p_id ",
              { 
              	comp_type: entity.comp_type,
              	comp_color: entity.comp_color,
              	comp_remark: entity.comp_remark,
              	description: entity.description,
              	p_id: entity.p_id 
              },
              { autoCommit: true },
              function(err, results){
                console.log('component update error commit:', err);
                console.log('component update results:', results);
                  if (err) {
                    console.log('component update error :', err);
                      connection.release(function(err) {
                          if (err) {
                              console.error(err.message);
                          }
                      });
                      return callback(err);
                  }

                  callback(null, results);

                  connection.release(function(err) {
                      if (err) {
                          console.error(err.message);
                      }
                  });
              });
        }
    );
};

component.prototype.insert = function(entity, cb){
	console.log('entity insert:', entity);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
        function(err, connection){
          console.log('insertComponent error :', err);
            if (err) {
                return cb(err);
            }
     		connection.execute(
              'insert into component ( ' +
              '   p_id, ' +
              '   comp_type, ' +
              '   comp_color, ' +
              '   comp_remark, ' +
              '   description ' +
              ') ' +
              'values (' +
              '    :p_id, ' +
              '    :comp_type, ' +
              '    :comp_color, ' +
              '    :comp_remark, ' +
              '    :description ' +
              ') ' +
              'returning ' +
              // '   mid, ' +
              //'   location, ' +
              '   comp_type ' +
              'into ' +
              // '   :rmid, ' +
              //'   :rlocation, ' +
              '   :rcomp_type',
              {
                  p_id: entity.p_id,
                  comp_type: entity.comp_type,
                  comp_color: entity.comp_color,
                  comp_remark: entity.comp_remark,
                  description: entity.description,
                  rcomp_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                  }
              }, { autoCommit: true },
              function(err, results){
                console.log('[component] error :', err);
                console.log('[component] results:', results);
                  if (err) {
                    console.log('[component] error:', err);
                      connection.release(function(err) {
                          if (err) {
                              console.error(err.message);
                          }
                      });
                      return cb(err);
                  }

                  cb(null, {
                      comp_type: results.outBinds.rcomp_type[0]
                  });

                  connection.release(function(err) {
                      if (err) {
                          console.error(err.message);
                      }
                  });
              });
        }
    );
};

component.prototype.delete = function(p_id, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  }, function(err, connection){
          console.log('delete error :', err);
            if (err) {
                return callback(err);
            }
      		//console.log('connection :', connection);
          	connection.execute(
              'DELETE FROM component WHERE p_id = :p_id ',
              { p_id: p_id },
              { autoCommit: true },
              function(err, results){
                console.log('eeerrrr:', err);
                console.log('results:', results);
                  if (err) {
                    console.log('erroro:', err);
                      connection.release(function(err) {
                          if (err) {
                              console.error(err.message);
                          }
                      });
                      return callback(err);
                  }

                  callback(null, results);

                  connection.release(function(err) {
                      if (err) {
                          console.error(err.message);
                      }
                  });
              });
        }
    );
};

module.exports = component;