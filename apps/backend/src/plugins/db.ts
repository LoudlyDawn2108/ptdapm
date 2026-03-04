import Elysia from "elysia";
import { db } from "../db";

export const dbPlugin = new Elysia({ name: "database" }).decorate("db", db);
