##initial thoughts
> 2016_08_31 - onboarding jason

[ Please check this in somewhere — perhaps “docs/tests/initial thoughts“? ]

###There are 4 Major Parts of the system in terms of testing targets:

####1. “oak-roots” (src/oak-roots)
- This is generic code for solving JS problems.
- Testing this stuff (for the most part) won’t involve React or the rest of the system.
- Mocha (https://mochajs.org/) + Chai (http://chaijs.com/) are the tools for this.
- This will be the easiest to start testing as it doesn’t involve UI testing.
- Possible to split this into a separate project/sub-module, but not urgent.

####2. “SUI Component Wrappers” (src/theme/SUI)
- React wrappers for the Semantic UI widget set (http://semantic-ui.com)
- Basically I wrote wrappers around someone else’s widget library so I didn’t have to reinvent them all.
- It would be useful to the web release this as a separate project (I don’t know of another comprehensive wrapper for this awesome toolset).  To do so, we’d want comprehensive tests as well as an internal review of how I’ve set up the properties on all of the objects to make sure the language is consistent, etc.
- Testing will require React, but not necessarily the rest of the oak system.
- Enzyme (https://github.com/airbnb/enzyme) is the tool for this, possibly with screen snapshotting tools (e.g. Selenium or Phantom-JS based).
- This will get us into testing React components.

####3. “oakjs” (src/oak)
- This is the special sauce that allows you to load JSX files (think XML with types), edit them live and then save.
- There’s a lot of magic here, but demystifying and streamlining it is a very high goal.  Ideally, you’ll understand what all the pieces do — if it’s too complicated for me to explain, it’s probably too magical.
- There are a lot of components (src/oak/components) which can be tested with Enzyme.
- There’s some generic Javascript-y stuff that we can test with Mocha/Chai.
- Testing the full system will require Selenium/PhantomJS/etc as this is where the rubber meets the road on integration.

####4. “projects” (src/oak/projects)
- These are the actual projects used by the system.
- Note that the “editor” application is in the “_runner” project, so eventually we’ll be editing the editor in the editor.  We’ll likely split these “editor projects” out from the “user projects” somewhat soon.
- Eventually the “user projects” will move into a separate source tree (or possibly an auto-created git submodule) since we don’t want you downloading my stuff.
- We’ll probably want to test the “editor” application stuff using the same principles as “oakjs” above. (Or maybe this *is* the testing for the oakjs system).
- We’ll want to think about how to allow users to write their own tests / test their own projects, but it’s not crucial in the short term.


####Other areas where you’ll be of immense help:
- pushing me to stick to JS style guide (http://airbnb.io/projects/javascript/) and maybe CSS Styleguide (https://github.com/airbnb/css)
- documentation / public web site (pushing me for it as much as writing it yourself)
- creating sample projects
- using the tool to extend the tool
- **long term:**
     - writing components,
     - extending the system,
     - developer relations,
     - management
