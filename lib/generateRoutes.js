require('locus')
const crypto = require('crypto');
const generateRoutes = {
  id: function(){
    return crypto.randomBytes(10).toString('hex');
  },
  generateAdminId: function(){
    return crypto.randomBytes(5).toString('hex');
  },

  generateVotePath: function(request){
    return `${request.protocol}://${request.get('host')}/poll/`
  },

  generateAdminPath: function(request){
    return `${request.protocol}://${request.get('host')}/admin`
  }


};

module.exports = generateRoutes;
