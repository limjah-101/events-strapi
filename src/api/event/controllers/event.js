"use strict";
const { sanitizeOutput } = require("@strapi/utils");

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

//module.exports = createCoreController('api::event.event');

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.response.badRequest(null, [
        { messages: [{ id: "No authorisation" }] },
      ]);
    }

    // this will fetch only events by id
    // const data = await strapi.entityService.findOne("api::event.event", user.id, {
    //     populate: {user: true}
    // });

    // this will fetch the user with the relation
    const data = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: user.id },
        populate: { events: true },
      });

    const d = strapi.db.query("api::event.event").findMany({
      // uid syntax: 'api::api-name.content-type-name'
      where: {user: user.id}, populate: {user: true}
    });

    if (!d) {
      return ctx.response.notFound();
    }
    return d;

    //return sanitizeOutput(data, { model: strapi.models.events });
  },
}));
