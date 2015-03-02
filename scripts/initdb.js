#!/usr/bin/env node

// ---------------------------------------------------------------------------------------------------------------------
// Script to populate the database with initial data.
//
// @module initdb.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var program = require('commander');
var Promise = require('bluebird');

var package = require('../package');
var models = require('../lib/models');

// Initial data files
var accounts = require('../data/accounts');
var characters = require('../data/characters');
var ship_instances = require('../data/ship_instances');
var ship_templates = require('../data/ship_templates');

// ---------------------------------------------------------------------------------------------------------------------

program
    .version(package.version)
    .description('initializes the database with data')
    .option('-p, --production', 'Production mode. (Skips populating development accounts.)')
    .parse(process.argv);

// ---------------------------------------------------------------------------------------------------------------------

function loadClean(Model, initialData)
{
    console.log('Loading table "%s"...', Model.getTableName());

    return Model.delete().execute().then(function()
    {
        return Promise.all(_.reduce(initialData, function(results, data)
        {
            results.push((new Model(data)).save());
            return results;
        }, []));
    });
} // end loadClean

// ---------------------------------------------------------------------------------------------------------------------

// Delete all existing ship templates
var loadPromise = loadClean(models.ShipTemplate, ship_templates);

// Check to see if we're in production mode
if(!program.production)
{
    loadPromise = loadPromise
        .then(function()
        {
            return Promise.join(
                loadClean(models.Account, accounts),
                loadClean(models.Character, characters),
                loadClean(models.ShipInstance, ship_instances)
            );
        });
} // end if

// We're done loading
loadPromise
    .then(function()
    {
        console.log('Finished loading.');
        process.exit();
    });

//----------------------------------------------------------------------------------------------------------------------
