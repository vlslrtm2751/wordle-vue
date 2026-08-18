# Layout tests

Headless browser checks that the app fits inside a phone screen without ever
scrolling. They run against the dev server and are not part of the build.

```bash
npm run dev -- --port 5199
```

Then open (or screenshot) these pages:

| Page | What it checks |
| --- | --- |
| `test/mobile-layout.html` | No scroll on either axis, and every key / tile fully inside the viewport, across 8 phone viewports incl. landscape. Also asserts tiles stay square. |
| `test/native-keyboard.html` | The phone-keyboard bridge: letters arrive, backspace deletes exactly once whether the IME reports a real key or not, and the on-screen keyboard swaps to the compact status strip when the native keyboard takes the bottom of the screen. |
| `test/visual.html` | Side-by-side render of the app at several viewports, including one with the native keyboard simulated. For eyeballing / screenshots. |

`native-keyboard.html` and the last panel of `visual.html` need a coarse pointer
emulated, otherwise the app correctly decides it is on a desktop:

```bash
msedge --headless=new --window-size=800,1100 \
  --blink-settings=availablePointerTypes=2,primaryPointerType=2,availableHoverTypes=1,primaryHoverType=1 \
  --virtual-time-budget=90000 \
  --dump-dom http://localhost:5199/wordle-vue/test/native-keyboard.html
```

Each page ends with `RESULT: ALL PASS` or `RESULT: n FAILURE(S)`, mirrored into
`document.title` so `--dump-dom` output can be grepped.

## Known harness limitation

Chrome fires no `resize` event inside an iframe that its parent resized, even
though `visualViewport.height` updates. The tests therefore dispatch that event
themselves; the app's handler still reads the real, already-updated viewport.
Actual native-keyboard detection on a device is not covered here — see the
real-device checklist in the pull request.
