import { envs } from "../src/config/envs";
import { Approutes } from "../src/presentation/router";
import { Server } from "../src/presentation/server";

export const testServer = new Server({
  port: envs.PORT,
  routes: Approutes.routes,
});
