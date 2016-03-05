const crypto = require('crypto');

module.exports = () => {
  return crypto.randomBytes(10).toString('hex');
};

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

}
