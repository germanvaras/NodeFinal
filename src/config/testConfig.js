require('dotenv').config();
const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const requester = supertest.agent(`http://localhost:${process.env.PORT}`);

module.exports = { expect, assert, requester };