import { ModelCodegen } from '../lib';

describe('CodeGen', () => {

    describe('Write File', () => {
        // Load forms using the @forms declared in package.json
        ModelCodegen.codegen(__dirname + '/forms', __dirname + '/codegen.json', __dirname + '/models/en-AU.json').then(() => {
            console.log('success');
        }).catch((err) => {
            console.log('failure', err);
        });
    });

});
