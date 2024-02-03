import { getUserNameFromArgv } from "./getUserNameFromArgv.js";

export function sayHiToUser() {
  const username = getUserNameFromArgv() ?? 'Anonymous';

  console.log(`Welcome to the File Manager, ${username}!`);

  process.on('exit', () => console.log(`Thank you for using File Manager, ${username}, goodbye!`))
}