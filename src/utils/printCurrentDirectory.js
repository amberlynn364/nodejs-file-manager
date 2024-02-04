export function printCurrentDirectory() {
  const currentWorkingDirectory = process.cwd();

  console.log(`You are currently in ${currentWorkingDirectory}`);
}