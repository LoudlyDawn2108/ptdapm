import Elysia from "elysia";
import { auth } from "../auth";

export const authPlugin = new Elysia({ name: "better-auth" }).mount(auth.handler);
