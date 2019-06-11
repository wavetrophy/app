# WAVETROPHY App


iOS:
Dont forget to set "Automatically manage signing" in the XCode App settings

# Ionic App Flow
## iOS
https://ionic.zendesk.com/hc/en-us/articles/360005248574-Setting-up-an-iOS-Security-Profile-for-Package
https://ionicframework.com/docs/appflow/package/credentials#ios-setup

Create a file that is for "iOS Distribution"
-> Download .cer file -> import into keychain -> right click -> export (.p12) -> set password (!!)
 -> create profile on ionic appflow -> set .12 file into "certificate", use same from export password here again
 -> create provisioning file in apple developer center
 
Fastlane Match might help

# Android
Just pass in the required data
