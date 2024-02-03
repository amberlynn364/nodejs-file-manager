export function getUserNameFromArgv() {

  const userName = process.argv
  .slice(2)
  .find(arg => arg.startsWith('--username='));

  return userName && userName.split('=')[1]; 
}