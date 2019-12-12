###11/12/19 10:00pm commit

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
###11/12/19 10:12pm Commit

1. Changed "About" dialogue design slightly.
2. Added unique window to settings.
3. Trying to open a unique window that is already open now makes it active and brings it to the front

---
Bugs found 

111219-1. When minimising the ribbon the desktop does not update the resize() which causes the canvas size to be reduced by a 10's of pixels

---
1. Fixed bug 111219-1 resize does not resize desktop and then indeed the canvas element.
