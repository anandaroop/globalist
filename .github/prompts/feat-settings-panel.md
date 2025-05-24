---
mode: "agent"
---

See .github/prompts/feat-settings.png for a rough wireframe of our next feature.

Let's modify the UI so that it has a right-hand panel for settings.

The first setting we will add is a combined text input + range slider for setting the "Central meridian" of the globe projection.

Requirements:

- Changes to the text input and range slider are synced. Moving the slider updates the text value. Every keystroke in the text input updates the slider.

- Each change to text input or slider updates the globe's map projection. The user can thus easily adjust the map projection in realtime with the input or slider.
