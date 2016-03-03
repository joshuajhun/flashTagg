const http = require('http');
const express = require('express')

const app = express();

app.user(express.static('public'))
