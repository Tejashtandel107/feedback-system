'use strict';

/**
 * feedback-campaign service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::feedback-campaign.feedback-campaign');
