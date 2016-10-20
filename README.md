#oakjs client
---


Oakjs Application Framework client + server.

---
###Getting Started

---
1. Clone package, cd into the directory.
2. `npm run setup` to initialize dependencies.
3. `npm start` to start the web server.

The application will be served on [http://localhost:3000](http://localhost:3000).

Note that projects are currently being saved within this repo -- eventually they'll move to a sub-repo with a symbolic link.

_________________

### Getting started on the devTests branch
1. Install the new devDependencies (chai and mocha)
`npm install` or `npm run setup` again.

2. Invoke the test script:
`npm test` or `npm t`

3. Tests are located here:
`test/*.js`

4. Invole test coverage script
`./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel/register`  
or  
`npm run coverage`  


### current test tools
Tool | Purpose | Install
-----|------|----------------
mocha | js test runner that can be executed from Node or from the browser | [mocha wiki][3]
chai | assertion library for mocha | [chaijs.com][4]


### potential test tools
Potential Tools | Purpose | Install
-----|------|----------------
istanbul | test coverage tool | $ npm install --save-dev istanbul
isparta | helps istanbul understand ES6 | $ npm install --save-dev isparta
sinon | Standalone test spies, stubs and mocks for js. No dependencies, works with any unit testing framework. | [sinonjs.org][5] 
