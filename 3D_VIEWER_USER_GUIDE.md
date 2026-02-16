# 🎮 3D Model Viewer - User Guide

## Quick Start

Visit any model page (e.g., `/model/1`) to see the interactive 3D viewer.

---

## 🎯 Main Controls (Bottom Toolbar)

### 🔄 Auto-Rotate Button
**What it does**: Automatically rotates the model 360° continuously

**How to use**:
1. Click the 🔄 button
2. Watch the model spin smoothly
3. Click again to stop

**When to use**:
- Hands-free viewing
- Presentations
- Getting a complete view without manual rotation

**Visual feedback**:
- Orange glow when active
- "Auto-Rotate ON" appears at top

---

### 🔲 Wireframe Button
**What it does**: Shows the model's edge structure and topology

**How to use**:
1. Click the 🔲 button
2. See the wireframe overlay
3. Click again to return to solid view

**When to use**:
- Checking polygon flow
- Inspecting topology quality
- Understanding model structure
- Verifying clean geometry

**Visual feedback**:
- Orange glow when active
- "Wireframe ON" appears at top
- Model shows as lines/edges

---

### #️⃣ Grid Button
**What it does**: Toggles the floor grid on/off

**How to use**:
1. Click the #️⃣ button
2. Grid disappears
3. Click again to show grid

**When to use**:
- Clean screenshots without grid
- Focus on model only
- Presentation mode

**Visual feedback**:
- Cyan glow when grid is visible
- Gray when grid is hidden
- "Grid Hidden" appears at top when off

---

### 💥 Exploded View Button
**What it does**: Separates model parts to show internal structure

**How to use**:
1. Click the 💥 button
2. Watch parts smoothly separate
3. Click again to reassemble

**When to use**:
- Understanding how parts fit together
- Checking internal details
- Verifying separate objects
- Educational purposes

**Visual feedback**:
- Purple glow when active
- "Exploded View" appears at top
- Parts animate smoothly

---

### 📷 Screenshot Button
**What it does**: Captures current view as PNG image

**How to use**:
1. Position the model how you want
2. Click the 📷 button
3. Image downloads automatically

**When to use**:
- Documentation
- Portfolio
- Sharing with team
- Reference images

**Output**:
- PNG file
- Filename: `model-screenshot-[timestamp].png`
- Full resolution

---

### ⛶ Fullscreen Button
**What it does**: Expands viewer to fill entire screen

**How to use**:
1. Click the ⛶ button
2. Viewer goes fullscreen
3. Press ESC to exit

**When to use**:
- Detailed inspection
- Presentations
- Immersive viewing
- Focus mode

---

## 🎬 Animation Controls (Left Sidebar - Desktop)

### 🦴 Skeleton Toggle
**What it does**: Shows/hides the model's bone structure

**How to use**:
1. Click "Show Skeleton" button
2. See the rig overlay
3. Click "Hide Skeleton" to turn off

**When to use**:
- Checking rig quality
- Understanding bone placement
- Verifying deformation
- Learning rigging

---

### Animation Clips
**What it does**: Lists all available animations

**How to use**:
1. Click any animation name
2. Animation loads
3. Click again to deselect

**Available animations** (example):
- Idle
- Walk Cycle
- Run
- Jump
- Attack
- Death

**Visual feedback**:
- Orange highlight when selected
- "Playing..." indicator when active
- Animation count display

---

### Timeline Controls
**What it does**: Scrub through animation frame by frame

**How to use**:
1. Select an animation first
2. Drag the slider to seek
3. Use buttons for quick actions

**Buttons**:
- **⏮ Reset**: Jump to start (frame 0)
- **▶ Play**: Start animation playback
- **⏸ Pause**: Stop animation playback
- **⏭ Skip**: Jump to end (last frame)

**Display**:
- Time in minutes:seconds
- Percentage complete
- Current frame

---

### Playback Speed
**What it does**: Controls animation speed

**How to use**:
1. Drag slider (0.25x to 2.0x)
2. Or click quick buttons

**Quick speeds**:
- **0.5x**: Half speed (slow motion)
- **1.0x**: Normal speed
- **1.5x**: 1.5x faster
- **2.0x**: Double speed

**When to use**:
- Slow motion: Study details
- Normal: Preview as intended
- Fast: Quick review

---

### Quick Poses
**What it does**: Applies preset poses instantly

**Available poses**:
- **T-Pose**: Arms out horizontally
- **A-Pose**: Arms at 45° angle
- **Crouch**: Crouching position
- **Combat**: Fighting stance

**How to use**:
1. Click any pose button
2. Model snaps to pose
3. Deselects any playing animation

**When to use**:
- Quick reference
- Checking deformation
- Screenshot specific poses
- Testing rig

---

### Export Options
**What it does**: Save animation or recording

**Options**:
- **📹 Record Animation**: Capture to video
- **💾 Export Clip**: Save animation data

**How to use**:
1. Select animation
2. Click export button
3. File downloads

---

## 🎨 Material Swapper (Right Sidebar)

### What it does
Change model colors and textures in real-time

### How to use

#### Preset Colors
1. Click "Material Swapper" button
2. Click any preset color
3. Model updates instantly

**Available colors**:
- Orange, Red, Cyan, Purple
- Green, Gold, Silver, Black

#### Custom Color
1. Click color picker
2. Choose any color
3. Or type hex code (e.g., #ff6b35)

#### Custom Texture
1. Click "Click to upload texture map"
2. Select image file
3. Texture applies to model

#### Reset
- Click "Reset" to restore original

### When to use
- Match your game's color palette
- Test different materials
- Visualize customization
- See before buying

---

## 👻 Ghost-Compare Mode (Right Sidebar)

### What it does
Overlay another model to compare size and structure

### How to use
1. Click "Ghost-Compare" button
2. Select model to compare
3. Adjust opacity slider
4. Toggle wireframe/solid

### Features
- **Opacity**: 0-100% transparency
- **View Mode**: Wireframe or solid
- **Model Info**: Name and poly count
- **Clear**: Remove comparison

### When to use
- Compare model sizes
- Check topology differences
- Verify scale
- Choose between options

---

## 🖱️ Camera Controls

### Mouse (Desktop)
- **Left Click + Drag**: Rotate camera around model
- **Right Click + Drag**: Pan camera left/right/up/down
- **Scroll Wheel**: Zoom in/out
- **Hover**: Highlight model

### Touch (Mobile/Tablet)
- **Touch + Drag**: Rotate camera
- **Pinch**: Zoom in/out
- **Two-finger drag**: Pan camera

### Tips
- Double-click to reset camera
- Zoom in for details
- Pan to frame specific parts
- Rotate for all angles

---

## 📱 Mobile Interface

### Bottom Sheet
**Swipe up/down** to expand/collapse

**Tabs**:
1. **Details**: Model info and specs
2. **Features**: Material swapper, compare
3. **Controls**: Animation controls

### Toolbar
Simplified with essential buttons:
- 🔄 Auto-Rotate
- 🔲 Wireframe
- #️⃣ Grid
- 💥 Exploded

### Tips
- Use landscape for better view
- Pinch to zoom
- Swipe to rotate
- Tap buttons for features

---

## 💡 Pro Tips

### For Buyers
1. **Check Topology**: Use wireframe mode
2. **Test Animations**: Play all clips
3. **Verify Scale**: Use ghost-compare
4. **Inspect Details**: Zoom in close
5. **Screenshot**: Save reference images

### For Creators
1. **Showcase Quality**: Enable auto-rotate
2. **Highlight Structure**: Use exploded view
3. **Demo Animations**: Show all clips
4. **Prove Quality**: Show wireframe
5. **Professional Shots**: Use screenshot

### For Developers
1. **Check Poly Count**: See in specs panel
2. **Test Animations**: Verify all clips work
3. **Inspect Rig**: Show skeleton
4. **Verify Formats**: Check available exports
5. **Compare Options**: Use ghost-compare

---

## 🎯 Common Use Cases

### Scenario 1: Buying a Character
1. Enable auto-rotate for full view
2. Toggle wireframe to check topology
3. Play all animations
4. Check skeleton structure
5. Compare with other characters
6. Take screenshot for reference
7. Purchase if satisfied

### Scenario 2: Quality Check
1. Zoom in close
2. Enable wireframe
3. Check for clean geometry
4. Verify no overlapping faces
5. Test all animations
6. Check deformation quality
7. Inspect texture resolution

### Scenario 3: Presentation
1. Enter fullscreen mode
2. Enable auto-rotate
3. Play key animations
4. Show exploded view
5. Demonstrate features
6. Take screenshots
7. Exit fullscreen

### Scenario 4: Comparison
1. Open first model
2. Enable ghost-compare
3. Select second model
4. Adjust opacity
5. Toggle wireframe
6. Compare poly counts
7. Make decision

---

## ⚡ Keyboard Shortcuts (Coming Soon)

**Planned shortcuts**:
- `Space`: Play/Pause animation
- `R`: Toggle auto-rotate
- `W`: Toggle wireframe
- `G`: Toggle grid
- `E`: Toggle exploded view
- `F`: Fullscreen
- `S`: Screenshot
- `←/→`: Previous/Next animation
- `↑/↓`: Adjust playback speed

---

## 🔧 Troubleshooting

### Model not loading?
- Check internet connection
- Refresh page
- Try different browser

### Slow performance?
- Close other tabs
- Disable auto-rotate
- Hide grid
- Use solid view (not wireframe)

### Controls not working?
- Click on viewer first
- Check if fullscreen is active
- Try refreshing page

### Screenshot not downloading?
- Check browser permissions
- Allow downloads
- Try different browser

---

## 📊 Performance Tips

### For Best Performance
1. Close unnecessary tabs
2. Use Chrome or Firefox
3. Update graphics drivers
4. Disable browser extensions
5. Use solid view over wireframe

### For Best Quality
1. Zoom in for details
2. Use fullscreen mode
3. Enable all lighting
4. Take high-res screenshots
5. Use desktop for best experience

---

## 🎓 Learning Resources

### Understanding 3D Models
- **Poly Count**: Number of polygons (lower = better performance)
- **Topology**: How polygons flow (clean = better deformation)
- **Rigging**: Bone structure (good rig = better animation)
- **Textures**: Surface details (higher res = better quality)

### Animation Basics
- **Idle**: Standing still animation
- **Walk Cycle**: Walking loop
- **Run**: Running animation
- **Jump**: Jumping motion
- **Attack**: Combat animation

### Material Properties
- **Diffuse**: Base color
- **Normal**: Surface detail
- **Roughness**: How rough/smooth
- **Metallic**: How metallic
- **AO**: Ambient occlusion (shadows)

---

## 🚀 Advanced Features

### For Power Users
1. **Combine Features**: Use multiple at once
2. **Custom Workflows**: Create your inspection routine
3. **Batch Review**: Quickly check multiple models
4. **Documentation**: Screenshot all angles
5. **Comparison**: Build comparison sheets

### For Professionals
1. **Quality Assurance**: Full inspection checklist
2. **Technical Review**: Verify all specs
3. **Animation Testing**: Test all clips
4. **Performance Check**: Monitor FPS
5. **Export Planning**: Check available formats

---

## 📞 Need Help?

### Support Options
- 📧 Email: support@nexusmodels.com
- 💬 Discord: [Join community]
- 📖 Docs: [Full documentation]
- 🎥 Video: [Tutorial playlist]

### Report Issues
- Bug reports: [GitHub Issues]
- Feature requests: [Feedback form]
- General questions: [Community forum]

---

**Enjoy exploring 3D models like never before! 🎨**

---

**Last Updated**: February 16, 2026
**Version**: 1.0.0
**Status**: ✅ All Features Working
