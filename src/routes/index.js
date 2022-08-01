module.exports = ({
  app,
  C,
  handlers
}) => {
  // /healthcheck
  app
    .route(C.routes.healthcheck.path)
    .get(handlers.healthcheck)
}