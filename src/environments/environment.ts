// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  storage: {
    TOKEN_KEY: 'token_access',
    TOKEN_REFRESH_KEY: 'token_refresh',
  },
  production: false,
  url: 'http://localhost:8100',
  api: {
    // url: 'https://wave.d4rkmindz.ch',
    url: 'https://wavetrophy.dev',
  },
  firebase: {
    apiKey: 'AIzaSyDRPvblPfez5t1w0Qk8-IV83SG0lwdmrAA',
    authDomain: 'wavetrophy-app.firebaseapp.com',
    databaseURL: 'https://wavetrophy-app.firebaseio.com',
    projectId: 'wavetrophy-app',
    storageBucket: 'wavetrophy-app.appspot.com',
    messagingSenderId: '659785198054',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
