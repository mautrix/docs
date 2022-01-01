# Android VM setup (not recommended)
This page documents how to setup WhatsApp in an Android Virtual Machine. It
could be useful if you cannot or don't want to run WhatsApp on a mobile phone.

**Running in a virtual machine is more suspicious and increases the risk of
getting banned. A physical phone is recommended.**

## Requirements
You'll need a working Android SDK. You can use the
[Android Studio suite](https://developer.android.com/studio/) or only the
[command-line tools](https://developer.android.com/studio/#command-tools).

Currently the Android SDK appears to only work with OpenJDK8 (not 11), which
will need to be installed.

WhatsApp in the in the Android VM will need to scan a QR-code via webcam. We can
do this by passing the emulator a real webcam (which needs to be able to see the
emulator screen) or a virtual one (e.g. [v4l2loopback](https://github.com/umlaeute/v4l2loopback)).

## Android Virtual Device

Let's create an AVD (Android Virtual Device), get its webcam working and install
WhatsApp.

### Create the AVD

WhatsApp currently requires Android 2.3.3 (API 10) or newer. If you wish to
install WhatsApp through the play store, choose a System Image supporting Google APIs.

The AVD will be created in `~/.android/avd/`, regardless of the method you use
to create it.

#### Using Android Studio

Android Studio offers an [AVD Manager interface](https://developer.android.com/studio/run/managing-avds)
to create, configure and run AVDs.

#### Via command line

It's also possible to create an emulated android device from command line, using
[avdmanager](https://developer.android.com/studio/command-line/avdmanager) from
the Android SDK:

##### Install the required SDK components

Change the version and architecture as required. If your host has KVM support
you should use the x86 target. If you don't have KVM support (running in certain
VPS systems) then you will need to use the ARM targets.

```shell
./tools/bin/sdkmanager --install platform-tools emulator
./tools/bin/sdkmanager --install "platforms;android-24"
./tools/bin/sdkmanager --install "system-images;android-24;default;armeabi-v7a"
```

Once you have the SDK setup you can create a VM.

```shell
./tools/bin/avdmanager create avd -n AVD_NAME -k SDK_ID
e.g.:
./tools/bin/avdmanager create avd -n MyWhatsAppVM -k "system-images;android-24;default;armeabi-v7a"
or when using KVM (includes Play Store):
./tools/bin/avdmanager create avd -n MyWhatsAppVM -k "system-images;android-28;google_apis_playstore;x86"
```

Run the AVD using the Android Emulator:

```shell
./emulator/emulator -show-kernel -no-boot-anim -avd AVD_NAME
```

### Set up the webcam

Android Emulator seems to support different ways to feed custom images/videos to
the Android Webcam, but somehow the only one that worked for me is passing it
the host's camera (i.e. using `webcam0` camera mode).

`webcam0` seems to always be connected to the device `/dev/video0`. In case you
wish to use a different device (e.g. `/dev/video2`), rename it to `/dev/video0`:

```shell
# needed if you want to feed /dev/video2 to the AVD
sudo mv /dev/video0 /dev/video0.original
sudo mv /dev/video2 /dev/video0
```

Set the back-camera mode to `webcam0`, either using the AVD Manager GUI (enable
`Show Advanced Settings`) or by running the emulator from command line:

```shell
./emulator/emulator -avd AVD_NAME -camera-back webcam0
```

#### Use `v4l2loopback` to create a virtual camera

Install the `v4l2loopback` module and load it:

```shell
modprobe v4l2loopback
```

This should create a new `/dev/video*` file. If needed, rename it as `/dev/video0`.

Feed your desktop into this virtual webcam, e.g. using:

```shell
ffmpeg -f x11grab -s 640x480 -i :0.0+10,20 -vf format=pix_fmts=yuv420p -f v4l2 /dev/video0
```

You can test whether it's working by watching your webcam
(e.g. with `mplayer tv:// -tv driver=v4l2:device=/dev/video0`).

The AVD's webcam should now show a piece of your desktop. When mautrix-whatsapp
(or WhatsApp Web) shows you the QR-code, just move its window onto the shared
desktop area.

### Boot the AVD

You can boot the AVD using the AVD Manager GUI, or calling the emulator via
command line:
```bash
./emulator/emulator -avd AVD_NAME [options]
```

Some useful options include:
* `-no-audio` and `-no-window`, to disable audio and video for the VM. With
  these the emulator can run headless.
* `-show-kernel`, display the console boot text instead of showing the boot GUI
* `-no-snapshot`, to cold boot the AVD (i.e. it will ignore some cache).
* `-memory MB`, to reduce the amount of RAM passed to the AVD. Unfortunately the
  emulator will force a minimum amount.

### Install WhatsApp

WhatsApp will only work with your phone number on a device per time: when you
log in on your AVD, the other devices will disconnect. If you install WhatsApp
on an AVD and copy such AVD, both copies will be able to run WhatsApp (although
not at the same time!)

WhatsApp can be installed using Google Play, if available, or with an APK. In
the latter case, just drag'n'drop the APK on the emulator's window or run
`adb install APK_FILE`.

In the 'Chats screen' goto 'Menu' > 'WhatsApp Web'. You can follow the
instructions and use WhatsApp Web to verify whether all is working.

You can now proceed to link your virtual android to the bridge as described on
the [authentication Page](./authentication.md).

NOTE: The bridge will cycle through multiple QR codes, you have to have
everything ready to go. You won't have time to copy/paste images so you will
need the VM and the Matrix client running on the same desktop.

After installation has finished ensure you open Android settings -> "Battery" ->
"All Apps" -> find WhatsApp and choose: "Do not optimize".

## Running Headless

Once everything is working, you can run the Android emulator headless, and even
copy it to a server or whatever.

Make sure that all the software we need (Android SDK, Emulator, system images
etc) is installed on the target host.

Copy your AVD over there (from `~/.android/avd/AVD_NAME.*` on your system to the
`~/.android/avd/` of the target host).

Run the emulator headless:

```shell
./emulator/emulator -avd AVD_NAME -no-audio -no-window [options]
```

If your AVD goes into sleep-mode or becomes unresponsive, you can try to reboot
it or to start WhatsApp main activity running
`am start -n 'com.whatsapp/.HomeActivity'` on your AVD
(or e.g. `adb [-s DEVICE_SERIAL] shell am start -n 'com.whatsapp/.HomeActivity'`
directly on your shell).

## Required packages

Here a list of the packages you'll need to install on various Linux
distributions to make everything work.

### Arch Linux

Either install [android-studio](https://aur.archlinux.org/packages/android-studio/)<sup>AUR</sup> or:
* android-tools
* [android-sdk](https://aur.archlinux.org/packages/android-sdk/)<sup>AUR</sup>
* [android-emulator](https://aur.archlinux.org/packages/android-emulator/)<sup>AUR</sup>
* android-x86-system-image-XX<sup>AUR</sup> (replace `XX` with the system image
  you wish to use)

**You might want to choose `jdk8-openjdk` as java-environment, as newer JDKs
seem to have problems with the Android stuff.**

Note that android-studio and the other packages aren't fully compatible: the
system image path will differ slightly and you'll need to fix it in the AVD
`config.ini` files: `image.sysdir.1` should be something like
`system-images/android-15/default/x86/` for Android Studio images, and
`system-images/android-15/x86/` for AUR system images. The emulator will
otherwise fail printing `Cannot find AVD system path. Please define ANDROID_SDK_ROOT`.

Install [v4l2loopback-dkms-git](https://aur.archlinux.org/packages/v4l2loopback-dkms-git/)<sup>AUR</sup> to use v4l2loopback.
