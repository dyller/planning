// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  usernameMinLength: 0,
  usernameMaxLength: 50,
  passwordMinLength: 0,
  passwordMaxLength: 50,
  emailMinLength: 0,
  emailMaxLength: 50,
  firebaseConfig: {
    apiKey: 'AIzaSyBHhFZR4ORksa8R9Gj17ro5tWRiSBQKUzo',
    authDomain: 'planning-e9a84.firebaseapp.com',
    databaseURL: 'https://planning-e9a84.firebaseio.com',
    projectId: 'planning-e9a84',
    storageBucket: 'planning-e9a84.appspot.com',
    messagingSenderId: '642336253762',
    appId: '1:642336253762:web:ce12e4cc88e9d71dc54adb',
    measurementId: 'G-FCLKGNXFL6'
  },
  rowModelPath: 'rowModel',
  taskModelPath: 'taskModel',
  taskTitleMinLength: 1,
  taskTitleMaxLength: 20,
  boardModelPath: 'boardModel',
  boardNameMinLength: 1,
  boardNameMaxLength: 20,
  fileModelPath: 'files',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
