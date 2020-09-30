## [Doughboy](https://doughboy.io)

A nutrition tracker built with React, TypeScript, Material-UI and Firebase. Hosted on Netlify.

## Features

-   Fully functional offline PWA built with [Workbox](https://developers.google.com/web/tools/workbox/)
-   Custom [Material-UI](https://material-ui.com/) theming.
-   Forms built with [Formik](https://jaredpalmer.com/formik/).
-   Nutrition calendar component build with CSS grid.
-   TypeScript, react-error-overlay, and eslint/tslint powered Webpack dev environment.
-   Error Logging with [LogRocket](https://logrocket.com/).

## 🚀 Quick start

1.  **Create .env and netlify.toml files in the root directory. That's where you'll add your own firebase config. For example:**

    ```sh
    FIREBASEKEY='############'
    AUTHDOMAIN='hello-world-#####.firebaseapp.com'
    DATABASEURL='https://hello-world-#####.firebaseio.com'
    MESSAGINGSENDERID='############'
    PROJECTID='hello-world-#####'
    STORAGEBUCKET=''
    ```

2.  **Install dependencies and start the development server.**

    ```sh
    # start dev server
    yarn dev

    # build for prod with bundle analyzer
    yarn build:debug
    ```
