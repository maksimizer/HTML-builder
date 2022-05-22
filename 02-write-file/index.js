const fs = require('fs');
const path = require('path');

const { stdout, stdin, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Please, type some text.\n');
stdin.on('data', data => {
  if (data.toString().includes('exit')) {
    exit();
  } else {
    output.write(data.toString());
  }
});
process.on('exit', () => stdout.write('Have a nice day!'));
process.on('SIGINT', exit);