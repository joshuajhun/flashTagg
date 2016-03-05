const crypto = require('crypto');
const generateRoutes = {
  id: function(){
    return crypto.randomBytes(10).toString('hex');
  },
  adminId: function(){
    return crypto.randomBytes(5).toString('hex');
  },

  votePath: function(request){
    return `${request.protocol}://${request.get('host')}/poll/`
  },
  adminPath: function(request){
    return `${request.protocol}://${request.get('host')}/admin`
  }


};

module.exports = generateRoutes;
