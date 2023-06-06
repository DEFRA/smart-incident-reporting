# Smart Incident Reporting Project

# Prerequisites

Node v16.x

First install the dependencies & build the application using:

`$ npm install`

followed by:

`$ npm run build` - This runs the build tasks, which currently are just building the CSS. This needs to be run on the initial install, if updates are made to the Sass, or if the "govuk-frontend" is updated.

If installing on a Windows machine you may encounter an error when running `$ npm run build` relating to your OS not being able to run the Bash scripts which are part of the installation. Should you have this problem first ensure that you have installed [Git for Windows](https://gitforwindows.org). Then run the command `$ npm config set script-shell %userprofile%\cmder\vendor\git-for-windows\bin\bash` followed by `$ npm run build`.

Now the application is ready to run:

`$ npm start` or `$ node index.js`

## Project structure

Here's the default structure for your project files.

- **bin** (build tasks)
- **client** (client js/sass code)
- **server**
  - **plugins**
  - **public** (This folder is publicly served)
    - **static** (Put all static assets in here)
    - **build** (This contains the build output files (js/css etc.) and is not checked-in)
  - **routes**
  - **services**
  - **views**
  - config.js
  - index.js (Exports a function that creates a server)
- **test**
- README.md
- index.js (startup server)

## Config

The configuration file for the server is found at `server/config.js`.
This is where to put any config and all config should be read from the environment.
The final config object should be validated using joi and the application should not start otherwise.

A table of environment variables should be maintained in this README.

## Plugins

hapi has a powerful plugin system and all server code should be loaded in a plugin.

Plugins live in the `server/plugins` directory.

## Logging

Logging is carried out using [hapi-pino](https://github.com/pinojs/hapi-pino#readme) and [Application Insights](https://github.com/microsoft/ApplicationInsights-node.js#readme).

## Views

The [vison](https://github.com/hapijs/vision) plugin is used for template rendering support.

The template engine used in nunjucks inline with the GDS Design System with support for view caching, layouts, partials and helpers.

## Static files

The [Inert](https://github.com/hapijs/inert) plugin is used for static file and directory handling in hapi.js.
Put all static assets in `server/public/static`.

Any build output should write to `server/public/build`. This path is in the `.gitignore` and is therefore not checked into source control.

## Routes

Incoming requests are handled by the server via routes.
Each route describes an HTTP endpoint with a path, method, and other properties.

Routes are found in the `server/routes` directory and loaded using the `server/plugins/router.js` plugin.

Hapi supports registering routes individually or in a batch.
Each route file can therefore export a single route object or an array of route objects.

A single route looks like this:

```js
{
  method: 'GET',
  path: '/hello-world',
  options: {
    handler: (request, h) => {
      return 'hello world'
    }
  }
}
```

There are lots of [route options](http://hapijs.com/api#route-options), here's the documentation on [hapi routes](http://hapijs.com/tutorials/routing)

## Tasks

Build tasks are created using simple shell scripts or node.js programs.
The default ones are found in the `bin` directory.

The task runner is simply `npm` using `npm-scripts`.

The predefined tasks are:

- `npm start` (Runs the application)
- `npm run build` (Runs all build sub-tasks)
- `npm run build:css` (Builds the client-side sass)
- `npm run lint` (Runs the lint task using standard.js)
- `npm run unit-test` (Runs the `lab` tests in the `/test` folder)
- `npm test` (Runs the `lint` task then the `unit-tests`)

## Testing

[Jest](https://jestjs.io/) is used for unit testing.

See the `/test` folder for more information.

## Linting

[standard.js](http://standardjs.com/) is used to lint both the server-side and client-side javascript code.

It's defined as a build task and can be run using `npm run lint`.


# Environment variables

The default values will be used if the environment variables are missing or commented out.

| name                                                         | description                                         | required | default               |                          valid                          |
| ------------------------------------------------------------ | --------------------------------------------------- | :------: | --------------------- | :-----------------------------------------------------: |
| NODE_ENV                                                     | Node environment                                    |    no    |                       |               development,test,production               |
| SERVICE_HOST                                                 | Application's URL                                   |   yes    | http://localhost:3000 |               development,test,production               |
| SERVICE_PORT                                                 | Port number                                         |    no    | 3000                  |                                                         |
| SERVICE_NAME                                                 | Name of the service                                 |    no    |                       |                       Any string                        |
| LOG_LEVEL                                                    | The level of logging                                |    no    | warn                  |                       warn, debug                       |
