import { App } from "./app/App.js";
import { getUserNameFromArgv } from "./utils/getUserNameFromArgv.js";

const username = getUserNameFromArgv() ?? 'Anonymous';

const app = new App(username);

