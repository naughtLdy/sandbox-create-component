import index from './utils';
import cac from 'cac';

const cli = cac();

cli.command('', 'Enter your component name').action(() => {
  index();
});

cli.help();

cli.parse();
