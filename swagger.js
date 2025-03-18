const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistem Evaluasi Kinerja Karyawan Bytelogic",
      version: "1.0.0",
      description: "Dokumentasi API untuk Sistem Evaluasi kinerja Karyawan Bytelogic",
    },
    servers: [{ url: "http://localhost:5000" }],
  }, 
  tags: [
    { name: "Users", description: "User management" },
    { name: "Manager", description: "Project management" },
    { name: "Karyawan", description: "createKaryawan, getKaryawan, dan getKaryawanId" },
    { name: "Client", description: "createClient dan getClient dan getClientId" },
    { name: "Review", description: "Employee evaluation" },
  ],
  apis: ["./routes/*.js"], // Pastikan semua endpoint di dalam folder routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
