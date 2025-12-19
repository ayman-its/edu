const Router = express.router()
const { getServices, getServiceById, createService, updateService, deleteService } = require("./services.controller");
Router.get("/", getServices);
Router.get("/:id", getServiceById);
Router.post("/", createService);
Router.put("/:id", updateService);
Router.delete("/:id", deleteService);
