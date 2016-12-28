const debug = require('debug')('service:index');
const service = require('feathers-knex');
const hooks = require('feathers-hooks');
const knex = require('knex');
const ilmoconfig = require('../../config/ilmomasiina.config.js')

module.exports = function (){ // 'function' needed as we use 'this'
  debug('Feathers')
  const app = this;

  // initialize db

  // create database connection
  const db = knex({
    client: 'mysql',
    connection: {
      user : ilmoconfig.mysqlUser,
      password : ilmoconfig.mysqlPassword,
      database : ilmoconfig.mysqlDatabase
    }
  });

  db.schema.dropTableIfExists('events').then(() => {
    debug('Dropped events table')
  }).then(() => {
    return db.schema.dropTableIfExists('attendees')
  }).then(() => {
    return db.schema.createTable('events', table => {
      debug('Creating events table')
      table.increments('id');
      table.string('name');
      table.dateTime('date');
      table.string('description');
      table.string('price');
      table.string('location');
      table.string('homepage');
      table.string('facebooklink');
    })
  }).then(() => {
    return db.schema.createTable('attendees', table => {
      debug('Creating attendees table');
      table.increments('id');
      table.integer('eventId');
      table.string('name');
      table.string('email');
    })
  }).then(() => {
    // create dummy event
    app.service('/api/events').create({
      name: 'Tapahtuma1',
      date: '2017-1-1 23:59:59',
      description: 'Hassu tapahtuma',
      price: 'sata euroo',
      location: 'wat',
      homepage: 'ei oo',
      facebooklink: 'ei oo'
    }).then(() => {
      debug('created event');
    });
  });

  app.use('/api/events', service({
    Model: db,
    name: 'events'
  }));

  app.service('/api/events').after(
    hooks.remove(
      // remove detailed info from things that get passed to /api/events
      'location',
      'homepage',
      'facebooklink',
      'price'
  ));
}
