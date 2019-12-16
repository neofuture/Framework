## Changelog

### 11/12/19 10:00pm commit - 38c19ee

1. Added a canvas for testing canvas position and window positioned above.
2. Fixed an issue with the window centralise button not showing when you resize a window.
3. Fixed an issue with logout not closing all windows.
4. Added Unique windows so if an id is passed then the window will be unique, its recommended when creating unique windows that the ID be negative.
5. Added sliders (wip) these are not based on PrimeNG but i needed one for settings to adjust the hue.
6. Fixed an issue with extended being missing from Toolbar Tabs.
7. removed the fixed id as this messes up the toolbar.
8. refactored the unique into an extra variable which can be passed as a unique name for the window, if supplied this window will become unique testable on the "About" Window.
9. Rebuilt language files.

---
### 11/12/19 10:12pm Commit - 7e2b140

1. Changed "About" dialogue design slightly.
2. Added unique window to settings.
3. Trying to open a unique window that is already open now makes it active and brings it to the front

---
Bugs found 

111219-1. When minimising the ribbon the desktop does not update the resize() which causes the canvas size to be reduced by a 10's of pixels

---
1. Fixed bug 111219-1 resize does not resize desktop and then indeed the canvas element.
---
### 12/12/19 9:25am Commit - 000b821

1. Added CS theme settings to add square corners to notification/message alerts

---
Bugs Found
121219-1. I have an issue with constant refresh in the console, this could be an angular bug that relates to IVY issue investigated and a video sent to Angular team - https://github.com/angular/angular/issues/34336

### 12/12/19 16:08pm Commit - 0cd4cce

1. Continued investigation into 121219-1 to rule out local code by trying to stop the issue.
2. Changed the way the tabs are resized to use component interaction `@Input` and `@Output` instead of `document.getElementById`
3. Changed the user profile image to use a variable and `[ngStyle]` instead of `document.getElementById`
4. Removed some un-needed resize logic from login process, as there wont be any tabs before login there is no reason to run the resize login
5. Refactored dialogs so the shadow DOM left/top is adjusted and not directly on the element in the DOM
6. Fixed a further issue introduced in tabs and the tab width.
7. Fixed an issue with windows not closing because of th reliance on transition end, having removed this and used a timer instead.
8. Fixed a but where the profile image at the bottom right would not show after logging out and then back in again.
---
### 13/13/19  11:30am Commit - b6f3690

1. Continued to refactor `getElementById` where i can to remove reliance on editing the DOM instead of the shadow.
2. For the desktop component i have implemented an `ngAfterViewInit` which speeds up the load time as i no longer have to set a 300 ms timer to wait for screen to render
3. Moved window handlers out of the `ngZone` and into there own zone to speed up window modification, this should stop change detection from triggering when a window is modified, which re-renders all the other windows.
---
### 13/13/19 12:15pm Commit - a420893

1. Refactored the window close event so that it now finds the last active window before the current window, this ensures we always most of the time have an active window. this was in the old version but got accidentally removed when we moved from transition to timer.
2. Formatted change log to match github markdown.
---
### 13/13/19 - 4eb5a8c

~~131319-1. When a window is set an auto timer to close, and the window is manually closed then the window time is still running in the background. This will also close any windows that are opened between closing the timed window and its closure time~~

1. Updated to Angular 9.0.0.rc6
2. fixed bug 131319-1
---
### 16/12/19 - 

1. Fixed CS theme background tab button colour
2. Fixed CS theme padding on window client area for border-less windows (full height)
3. Fixed CS theme padding on window client area for login box
4. Fixed CS theme single border issue on full height windows (on login window and splash screen)
5. CS theme settings additional elements to set the correct colour scheme
