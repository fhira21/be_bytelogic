const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Dokumentasi",
      version: "1.0.0",
      description: "Dokumentasi API untuk sistem evaluasi karyawan",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      { name: "Users", description: "API terkait pengguna (admin, karyawan, klien)" },
      { name: "Clients", description: "API terkait data klien bytelogic" },
      { name: "Karyawan", description: "API terkait data karyawan bytelogic" },
      { name: "Managers", description: "Api terkait data admin atau manager bytelogic" },
      { name: "Projects", description: "API terkait data Project bytelogic" },
      { name: "Evaluations", description: "Manajemen data untuk Evaluasi karyawan" },
      { name: "Reviews", description: "Manajemen data review pengguna terhadap perusahaan" },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};