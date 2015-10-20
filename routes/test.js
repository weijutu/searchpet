// var oracledb = require('oracledb');


// oracledb.getConnection({
//     user          : "group8",
//     password      : "Eightgroupad",
//     connectString : "140.117.79.132:1521/pdb4"
//   },
//   function(err, connection) {
//     if (err) { console.error(err.message); return; }
//     connection.execute("SELECT 12 + 34 AS result", [],
//       function(err, result) {
//         if (err) { console.error(err.message); return; }
//         console.log(result.rows);
//       });
// });