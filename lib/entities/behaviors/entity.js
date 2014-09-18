//----------------------------------------------------------------------------------------------------------------------
// Brief description for entity.js module.
//
// @module entity.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

function BaseEntity(entityDef, controller)
{
    this.controller = controller;

    // Check for a .save function
    if(entityDef.save)
    {
        entityDef.$save = entityDef.save;
    } // end if

    // Merge the definition with our instance
    _.merge(this, entityDef);
} // end BaseEntity

/**
 * Saves the entity's state. If the entity definition we were created with contains a `save()` function, then we store
 * that as `$save()` when we're constructed. Calling `save()` will then call `$save()` under the hood, allowing the
 * definition to control how it persists it's state. In the event that we don't have a `$save()` function, we simply
 * return an already resolved promise.
 *
 * @returns {Promise} Returns a promise that resolves if the save is successful.
 */
BaseEntity.prototype.save = function()
{
    if(this.$save)
    {
        return this.$save();
    }
    else
    {
        return Promise.resolve();
    } // end if
}; // end save

//----------------------------------------------------------------------------------------------------------------------

module.exports = BaseEntity;

//----------------------------------------------------------------------------------------------------------------------