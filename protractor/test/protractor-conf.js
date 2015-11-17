exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*-spec.js'],
    rootElement: 'body' //looks for ng-app attribute; if you don't put ng-app on body, then you need to move it "e.g. 'main'
};
