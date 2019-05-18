## [Doughboy](https://doughboy.io)

A nutrition tracker built with React, TypeScript, Material-UI and Firebase. Hosted on Netlify.


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

3.  **Deploy your own Doughboy tracker**

    [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/echoghi/doughboy)