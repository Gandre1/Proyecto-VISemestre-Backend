import FormularioController from "../controllers/FormularioController.js"

const routes = (app) => {
    app.use("/formulario", FormularioController)
}

export {routes}