# Pugjs Example Project



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need gulp, and npm to run and build the project.

```
npm install -g gulp
```

### Installing

Use npm install to download all the dependencies.

```
npm install
```

## Development

Use gulp to start the development server.

```
gulp
```

### Templates

The templates are made with Pug and there are located in app/src/templates, you can get the docs of it's page: https://pugjs.org/


### Styles

The css class names must be in spanish. We use BEM with prefixes:
- p- : Pages
- l- : Layouts
- c- : Components
- g- : General
- u- : Utilities
- h- : Helpers
- i- : Icons


### Scripts

We use ES6 for the scripts (are transpiled to ES5 by babel).

The scripts are located inside app/src/js. In the folder root are located the scripts that are excuted when the user moves between sections.

- app.js: This is the main script, the shared and intro vars are created here.


## Build

Use gulp dist to generate a zip in project folder.

```
gulp dist
```
