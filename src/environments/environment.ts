// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  firebase: {
    apiKey: "AIzaSyBJKVogWGYun4CYiNnFD4yN7i1NnCQ7uEg",
    authDomain: "nab3a-com.firebaseapp.com",
    databaseURL: "https://nab3a-com.firebaseio.com",
    projectId: "nab3a-com",
    storageBucket: "nab3a-com.appspot.com",
    messagingSenderId: "971682683190"
  },

  algolia: {
    appId: '2F1XIQFXH1',
    apiKey: '5c15a1e7fb5c0172d05af1f23fae6686' //search-only
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
