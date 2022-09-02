var inputfile = 'src/ingress.pomerium.io_pomerium.yaml',
  outputfile = 'src/k8sSettings.json',
  yaml = require('js-yaml'),
  fs = require('fs'),
  obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));
// this code if you want to save
fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));
