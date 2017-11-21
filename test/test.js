var expect  = require('chai').expect;
var request = require('supertest');
const assert = require('assert');
const Poll = require('../votes');

var app  = require('../server');

var votesData = { votes:
    { title: 'Title',
    question: 'question',
    choices: [ '1', '2' ],
    privatePoll: 'false' } }


describe('GET /', function(){
  it('responds with success', function(done){
    request(app).get('/').expect(200, done)
  });
});

describe('undefined routes', function(){
  it('respond with a 404', function(done){
    request(app).get('/not-real').expect(404, done);
  });
});


describe('server',function(){
  it('should exist', function(){
    assert(app)
  })
});
