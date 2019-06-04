#!/usr/bin/env bash
#Based on https://angularfirebase.com/snippets/deploying-ionic4-to-android-and-google-play/
PWD=$(pwd)
BUILD_TOOLS=/Users/bjorn/Library/Android/sdk/build-tools/28.0.3
NAME=WAVETROPHY
KEYSTORE=/Users/bjorn/code/nodejs/wavetrophy/dist/prod.keystore
BUILD_APK=${PWD}/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
RELEASE_APK=${PWD}/build/WAVETROPHY.apk
ZIPALIGN=${BUILD_TOOLS}/zipalign
APKSIGNER=${BUILD_TOOLS}/apksigner
JARSIGNER=jarsigner
# Copy relevant resources
echo "Working directory: ${PWD}" | tee ${PWD}/build.log
mkdir ${PWD}/build | tee ${PWD}/build.log

cp ${PWD}/resources/android/project.properties ${PWD}/platforms/android | tee ${PWD}/build.log

# Build the app
echo Building App ...
ionic cordova build android --prod --release | tee ${PWD}/build.log
echo App built

# Generate keystore
#keytool -genkey -v -keystore /Users/bjorn/Google\ Drive/Business/WAVETROPHY/App/Android/Keys/wavetrophy-release-key-android.keystore -alias WAVETROPHY -keyalg RSA -keysize 2048 -validity 10000

# Sign it
echo "Signing ..."
#${JARSIGNER} -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${KEYSTORE} -storepass ${PASS} ${BUILD_APK} ${NAME} | tee ${PWD}/build.log
${ZIPALIGN} -f -v 4 ${BUILD_APK} ${BUILD_APK}.tmp | tee ${PWD}/build.log
${APKSIGNER} sign --ks ${KEYSTORE} --ks-pass stdin --v2-signing-enabled=true --out ${RELEASE_APK} ${BUILD_APK}.tmp | tee ${PWD}/build.log
#rm -f $TMP
echo "Signed"
echo "Zipping ..."
echo "Zipped"
echo "Verifying"
${APKSIGNER} verify -v ${RELEASE_APK} | tee ${PWD}/build.log
export CORDOVA_ANDROID_RELEASE_BUILD_PATH=${RELEASE_APK}
echo Using ${CORDOVA_ANDROID_RELEASE_BUILD_PATH}

