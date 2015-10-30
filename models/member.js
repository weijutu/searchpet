var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var auth = require('../settings/auth.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


//UPDATE "GROUP8"."MEMBER" SET R_ID = 'f865d0e9-e86f-4c3f-921c-734340d95567' WHERE ROWID = 'AAAWehAABAAAH1xAAA' AND ORA_ROWSCN = '2901385'
function member(m){
	this.m_id = m.m_id;
	this.r_id = m.r_id;
	this.account = m.username;
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
	  	// console.log(connection);
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

member.prototype.getMemberByUsername = function(username, callback){
  console.log('m_id:', username);
  oracledb.getConnection({
      user          : config.oracle.user, 
      password      : config.oracle.password,
      connectString : config.oracle.connectionstring
    },
    function(err, connection) {
      // console.log(connection);
      if (err) { console.error(err.message);  }
      connection.execute("select * from member where account=:username", 
        { username: username }, 
        { outFormat: oracledb.OBJECT },
        function(err, result){
        if (err) {
          console.error(err.message);
          return;
        }
        // console.log('result.rows:', result.rows);
        // console.log('[getMemberByUsername] result:', result);
        callback(err, result);
      });
  });
};

//透過會員編號取得會員資料
member.prototype.getEntityById = function(m_id, callback){
	// console.log('m_id:', m_id);
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  },
	  function(err, connection) {
	  	// console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from member where m_id=:m_id", 
	    	{ m_id: m_id }, 
	    	{ outFormat: oracledb.OBJECT },
	    	function(err, result){
	    	if (err) {
	    		console.error(err.message);
	    		return;
	    	}
	    	// console.log('result.rows:', result.rows);
	    	console.log('[member getEntityById] result:', result);
        callback(err, result);
	    });
	});
};

//會員刪除
member.prototype.delete = function(mId, callback){
	oracledb.getConnection({
	    user          : config.oracle.user, 
	    password      : config.oracle.password,
	    connectString : config.oracle.connectionstring
	  }, function(err, connection){
          console.log('delete error :', err);
            if (err) {
                return callback(err);
            }
      		console.log('connection :', connection);
          connection.execute(
              'DELETE FROM member WHERE m_id = :m_id ',
              { m_id: mId },
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

member.prototype.insert = function(user, cb){
	oracledb.getConnection(
        config.database,
        function(err, connection){
          console.log('insertUser error :', err);
            if (err) {
                return cb(err);
            }
      // console.log('connection :', connection);
          connection.execute(
              'insert into member ( ' +
              '   m_id, ' +
              '   r_id, ' +
              '   account, ' +
              '   password, ' +
              '   name, ' +
              '   email, ' +
              '   telphone ' +
              ') ' +
              'values (' +
              '    :m_id, ' +
              '    :r_id, ' +
              '    :account, ' +
              '    :password, ' +
              '    :name, ' +
              '    :email, ' +
              '    :telphone ' +
              ') ' +
              'returning ' +
              // '   mid, ' +
              '   email, ' +
              '   telphone ' +
              'into ' +
              // '   :rmid, ' +
              '   :remail, ' +
              '   :rtelphone',
              {
                  m_id: user.m_id,
                  r_id: user.r_id,
                  account: user.username,
                  password: user.password,
                  name: user.name,
                  email: user.email,
                  telphone: user.telphone,
                  remail: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                  },
                  rtelphone: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                  }
              },
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
                      return cb(err);
                  }

                  cb(null, {
                      // mid: results.outBinds.rmid[0],
                      email: results.outBinds.remail[0],
                      telphone: results.outBinds.rtelphone[0]
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


module.exports = member;