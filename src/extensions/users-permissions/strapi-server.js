// ./src/extensions/users-permissions/strapi-server.js

module.exports = (plugin) => {
  const originalAuthFactory = plugin.controllers.auth;
  plugin.controllers.auth = ({ strapi }) => {

    const originalAuth = originalAuthFactory({ strapi });

    const originalRegister = originalAuth.register;

    originalAuth.register = async (ctx) => {

      // Call original register API
      await originalRegister(ctx);

      try {
        // Check user created successfully
        if (ctx.body && ctx.body.user) {

          const user = ctx.body.user;

          strapi.log.info(`New user registered: ${user.email}`);

          // Create teacher automatically
          const teacher = await strapi.entityService.create(
            'api::teacher.teacher',
            {
              data: {
                name: user.username,
                user: user.id,
              }
            }
          );
          strapi.log.info(`Teacher profile created: ${teacher.id}`);
        }
      } catch (error) {
        strapi.log.error(error);
      }
    };

    return originalAuth;
  };

  return plugin;
};