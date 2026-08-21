# Lovable Prompt — Bharat Freeze Dry Foods (BFF) Website (v3 — Multi-Ingredient Crush → Packet Reveal)

Build a premium, **maximally animated**, cinematic marketing website for **Bharat Freeze Dry Foods (BFF)** — a company that freeze-dries (lyophilizes) fruits, vegetables, gravies, spices, pre-cooked meals, superfoods, and pet food, with a strict cold-chain and export-quality focus.

**Tagline (hero + meta):** "Sourcing the Best Quality, For You."

**Core design principle for this build: animation is not a decoration on top of the site — it IS the site.** Every section transition, every hover, every scroll step, every page load should feel choreographed, like a high-budget food-brand commercial rather than a static webpage with some motion sprinkled in. If a competitor's site scrolls, ours should *perform*. Nothing should simply "appear" — everything enters, transforms, or transitions with intent.

**Design language:** 3D, cinematic, physics-driven, glassmorphism + organic food textures. Apple product-page polish meets a high-end food/agri export brand. Deep tones — ice blue, frost white, deep forest green, warm terracotta/spice orange as accents. Large type, smooth scroll (Lenis), scroll-triggered reveals via Framer Motion + GSAP ScrollTrigger. Use react-three-fiber/Three.js for hero 3D elements and layered CSS 3D transforms elsewhere.

Since real product photography isn't available yet, use AI-generated, cinematic, studio-lit food photography as placeholders (macro shots, dramatic lighting, ice/frost particle detail) — one consistent visual style site-wide.

---

🎬 HERO SECTION (Highest Priority)

This hero should feel like a premium cinematic advertisement rather than a traditional website banner.

Reference quality:
Luxury food commercial + Apple product reveal + cinematic VFX.

The entire sequence should look like a real commercial where fresh whole ingredients violently collide, burst into colorful particles, and eventually become the BFF product packet.

Rendering Priority
Primary (Preferred)

Build the hero using Antigravity's WebGL scene.

Use GPU rendering wherever possible.

The hero should support replacing placeholder assets with production-quality assets later without changing the scene logic.

Structure the scene so all media is modular.

hero/
    HeroScene.tsx
    IngredientController.ts
    PacketReveal.ts
    FrostParticles.ts
    HeroLighting.ts
    HeroCamera.ts

Allow replacing

heroSequence.webm
heroSequence.mp4
heroPoster.webp

at any time.

Fallback

If no video exists, recreate the sequence completely inside Antigravity using:

GPU particles
Sprite sheets
Physics simulation
Mesh instancing
Shader-driven dust
Motion blur
Bloom
Depth of Field

The fallback should still feel premium and intentional rather than attempting photoreal VFX.

Hero Environment

Create a full-screen cinematic stage.

Environment:

deep charcoal background
subtle blue frost haze
floating ice crystals
volumetric mist
cinematic rim lighting
cold atmosphere
shallow depth of field

No flat gradients.

The environment should feel premium and premium-brand focused.

Camera Direction

Use a virtual cinema camera.

Sequence:

Wide shot

↓

Medium shot

↓

Dynamic tracking

↓

Close-up packet reveal

↓

Slow floating hero shot

Camera should include:

subtle handheld drift
cinematic easing
realistic inertia
soft focus transitions

Never static.

Sequence
Scene 1 (0–2s)

Whole ingredients enter simultaneously from different directions.

Not grouped.

Mixed together.

Ingredients:

Fruits

Mango
Strawberry
Watermelon
Blueberries

Vegetables

Tomato
Garlic
Onion
Spinach

Spices

Red chili
Star anise
Black pepper
Turmeric root

Every ingredient:

unique trajectory
unique rotation
unique spin
random timing

Use real physics.

No synchronized animation.

Scene 2 (2–5s)

As ingredients reach center frame they collide.

Each ingredient has its own destruction style.

Mango
wet split
thick juice splash
golden mist
// SFX: wet snap
Strawberry
fibrous tear
seeds eject
pink spray
// SFX: juicy rip
Watermelon
heavy crack
juice explosion
rind fragments
// SFX: deep crack
Blueberries
tiny burst
violet droplets
// SFX: soft pop
Tomato
pulp explosion
seeds
red liquid
// SFX: splash burst
Garlic
cloves separate
papery shell flakes
// SFX: dry split
Onion
spinning slices
translucent layers
// SFX: crisp slice
Spinach
leaves shred
lightweight fragments
// SFX: leafy flutter
Chili
snaps
powder
seeds
// SFX: spicy crack
Star Anise
fractures
woody fragments
// SFX: woody snap
Peppercorns
scatter
some crush into dust
// SFX: tiny impacts
Turmeric
bright orange fracture
powder burst
// SFX: powder puff

Every collision generates

impact flash
radial shockwave
chromatic bloom
camera impulse
dynamic lighting response
Scene 3 (5–7s)

The debris fills the screen.

Particles begin converging.

Colors:

mango gold
tomato red
blueberry violet
turmeric amber
spinach green
chili crimson
frost white

Particles spiral inward.

Use GPU particle simulation.

Avoid simple keyframe motion.

Motion should resemble magnetic attraction.

Increase density dramatically.

This moment should resemble colorful fireworks collapsing into one point.

Before reveal:

Pause motion for

200–300ms.

Everything nearly freezes.

Scene 4 (7–9s)

Particles solidify into a premium stand-up pouch.

The packet appears as though made from the ingredients themselves.

No fade.

No dissolve.

Instead:

dust

↓

mist

↓

surface fragments

↓

complete package

Packet settles using

spring physics

with

slight overshoot

followed by

gentle settle.

Packet Design

The label must follow these exact branding rules.

BHARAT

Use Indian tricolor styling.

Top

Saffron

Middle

White

Bottom

Green

Can be

gradient

or

layered fill.

Not a background strip.

FREEZE DRY

Use

White

Natural Brown

representing purity and earthiness.

FOODS

Use vibrant ingredient colors.

Inspired by

Mango
Tomato
Blueberry
Turmeric
Greens

Each letter may use a different color.

Additional packet details

subtle frost crystals
condensation
matte packaging
metallic highlights
ingredient illustrations near bottom
premium print finish

Lighting

Perform a slow studio rim-light sweep across the packet.

Very subtle.

Scene 5 (9s+)

Packet becomes the persistent hero.

Very slow

floating

rotation

breathing animation

Tiny parallax.

No noticeable looping.

Tagline

"Sourcing the Best Quality, For You."

Fade upward after the packet settles.

Buttons

Explore Products

Get in Touch

Appear last.

Staggered.

Spring animation.

Use:

magnetic cursor
subtle 3D tilt
hover glow
depth movement
Scroll Transition

As scrolling begins,

the packet continues floating.

Then smoothly transforms into the navigation brand mark.

No cuts.

No disappearing.

Continuous morph.

Antigravity Effects

Use Antigravity features wherever applicable.

Preferred effects:

GPU particle simulation
WebGL shaders
Volumetric fog
Bloom
Motion blur
Chromatic aberration
Depth of Field
Dynamic lighting
Camera shake
Mesh instancing
Soft shadows
Physics collisions
Scroll-linked timeline
Morph transitions
GPU sprite rendering

Animations should remain smooth at 60 FPS.

Accessibility

Respect

prefers-reduced-motion.

Immediately display:

final packet
tagline
buttons

Disable

particles
camera motion
physics
floating debris

Keep the hero elegant and fully usable.

User Experience

Include a Skip Intro button from the first frame.

Hover interactions should remain responsive even while the intro plays.

Never block interaction.

Performance

Optimize aggressively.

Lazy load textures
Compress assets
Use GPU instancing
Frustum culling
Texture atlases
Reuse particle buffers
Pause off-screen animations
Target 60 FPS on modern devices
Gracefully reduce particle count on lower-powered hardware
Overall Creative Direction

The final experience should feel like a world-class product launch film compressed into an interactive homepage.

The emotional progression is:

Fresh Ingredients

↓

Energy

↓

Explosion

↓

Transformation

↓

Premium Product

↓

Trust

↓

Action

The visitor should immediately understand that real whole ingredients transform into premium freeze-dried food, creating a memorable first impression that anchors the entire brand experience.

---

### 🌀 SITE-WIDE MOTION SYSTEM (apply everywhere, not just the hero)

This is what makes the *rest* of the site match the hero's energy instead of falling flat after it:

- **Section-to-section transitions:** every major section transition should feel directional and physical — e.g., the previous section's content "settles/exits" (fade + slight scale/blur-out or particle-dissolve) as the next section's content "arrives" (slide/scale/particle-assemble in), rather than sections simply stacking with a plain fade. Use GSAP ScrollTrigger pinning + timeline choreography for these handoffs.
- **Page-to-page transitions:** use a shared transition layer (e.g., a quick frost-wipe or particle-dissolve overlay) between route changes so navigating feels like one continuous film rather than a page reload.
- **Micro-interactions everywhere:** buttons, nav links, and icons should have deliberate hover/press states (magnetic pull, spring-scale, color-morph fill) — never a flat color-swap default.
- **Recurring "crush/burst → reveal" motif:** reuse the hero's core idea (an item bursts/dissolves into particles, then the next thing materializes from those particles) as a signature transition style at key moments across the site — e.g., between Process Strip steps, when Category tiles activate, and when Product cards flip. This visual rhyme is what should make the whole site feel like "one animated system" instead of a hero followed by a static site.
- **Scroll-tied progress motif:** the icy-blue "frost line" scroll indicator (see Global Elements) should visibly react — pulse or ripple — at each major section handoff, reinforcing the cold-chain story.
- **Loading/skeleton states:** even loading states should use the frost/particle motif (e.g., a small dissolving ice-crystal loader) rather than a generic spinner.

---

### 🧊 GLOBAL ELEMENTS

- **Top utility bar / header:** Phone number prominent at the very top (click-to-call on mobile), plus social icons — Facebook, Instagram, YouTube, Pinterest, LinkedIn, Twitter/X, Snapchat — with animated hover states (icons morph/fill on hover).
- **Sticky nav:** Logo (BFF wordmark/icon) | Home | About Us | Products | B2B / Export | Inquiry | Contact. Nav becomes glassmorphic (frosted blur) on scroll, with the wordmark smoothly morphing in from the hero sequence on first load.
- **Cold-chain motif:** a recurring "frost line" scroll-progress indicator — a thin animated icy-blue line that fills as the user scrolls, evoking a temperature gauge, pulsing at section handoffs (see Motion System above).
- **Footer:** repeats phone number, social icons, quick links, and a small animated snowflake/frost particle field.

---

### 🏠 HOME PAGE (after hero)

1. **Process Strip — "How We Freeze-Dry"** (horizontal scroll-triggered, pinned, 3D storytelling section):
   - Step 1: Flash-freeze at **-5°C** in a vacuum chamber (3D animated vacuum chamber illustration with product inside).
   - Step 2: Vacuum + gentle warm-water-jacket heating triggers **sublimation** — water goes directly from ice to vapor without melting (animate ice crystals visibly evaporating as mist, product stays structurally intact).
   - Step 3: Product is fully dehydrated, retaining shape, color, and nutrients.
   - Step 4: Sealed in protective packaging for transport — long shelf life, no cold storage needed post-processing.
   - Each step card rotates/dissolves in via the crush→reveal motif as it activates on scroll.

2. **Category Showcase** (animated 3D tile grid, tiles tilt toward cursor):
   - Freeze-Dried Fruits
   - Freeze-Dried Vegetables (Organic line highlighted)
   - Freeze-Dried Gravies (onion, garlic, red, white bases)
   - Freeze-Dried Spices
   - Pre-Cooked Freeze-Dried Meals
   - Superfoods (Moringa, Blueberry — distinct premium sub-brand block with its own icon/badge)
   - **Pet Food — "Your Dog's BFF"** (playful animated dog illustration/3D character that reacts — tail wag on hover — distinct warmer color accent, still on-brand)

3. **B2B / Export Strip:**
   - B2C (retail direct)
   - B2B — small batch, HoReCa (Hotel/Restaurant/Catering), Bulk orders
   - Export — HoReCa export line
   - **White Labeling** — "Get your own brand on our product," visualized as a blank pouch animating into a custom-labeled pouch (label wraps around in 3D).
   - Emphasize: top-quality raw material sourcing, strict quality control, long shelf life, export-grade cold chain.

4. **Trust strip:** certification/hygiene/export-readiness icons with animated count-up numbers (shelf life in months, % nutrient retention, etc. — placeholder stats to be swapped for real data).

5. **CTA banner:** inquiry form teaser + WhatsApp quick-connect button (integration note below).

---

### 🛒 PRODUCTS PAGE — 3D Flip Hover Interaction (core requirement)

Grid of product cards (fruits, vegetables, gravies, spices, pre-cooked meals, superfoods, pet food — filterable via animated tab/pill filters).

**Each card:**
- Shows product image, name, short descriptor, and **price**.
- **On hover:** smooth **3D Y-axis flip** (`transform-style: preserve-3d`, `perspective`, `rotateY(180deg)` on `.card-inner`, ~0.6s cubic-bezier) revealing the back face with a related image of the same product (e.g., whole strawberry → sliced freeze-dried cross-section; sealed pouch → product poured out).
- Back face also reveals pack sizes, an "Add to Inquiry" button, and a "White-label available" tag where relevant.
- Cards lift with a soft 3D shadow + slight scale-up on hover in addition to the flip.
- Mobile: tap to flip instead of hover.

**Sub-sections:** Fruits, Vegetables (organic tag where applicable), Gravies (onion, garlic, red, white), Spices, Pre-Cooked Meals, Superfoods (premium card styling), and Pet Food ("Your Dog's BFF" heading, playful dog motif, warmer color accent, same flip interaction).

---

### 📍 ABOUT US PAGE
- Company story, mission (quality sourcing, cold-chain integrity, export standards).
- Embedded map / location block with a 3D pin-drop animation.
- Team / facility highlights (vacuum chamber facility imagery, quality control).

### 🌍 B2B / EXPORT PAGE
- B2C vs B2B (small/HoReCa/Bulk) vs Export-HoReCa vs White Labeling, each as its own animated panel with iconography and a dedicated inquiry CTA.

### 📝 INQUIRY PAGE
- Embedded Google Form (iframe), styled to match site theme inside a frosted-glass card container.
- WhatsApp direct-connect button for quick quantity-based auto-inquiries (integration note below).

### 📞 CONTACT US PAGE
- Phone number (large, click-to-call), email, address/location map, social icons repeated, contact form.

---

### 🔗 INTEGRATIONS TO SCAFFOLD (front-end placeholders; wire up later)
- **WhatsApp direct integration:** floating WhatsApp button opening a pre-filled chat template (tapping "Inquire on WhatsApp" from a product card pre-fills the product name).
- **Google Forms embed** for the Inquiry page.
- Social links wired to placeholder URLs (Facebook, Instagram, YouTube, Pinterest, LinkedIn, Twitter/X, Snapchat).

---

### ⚙️ TECHNICAL NOTES FOR LOVABLE
- React + Tailwind CSS.
- Animation stack: Framer Motion (UI/scroll reveals, page transitions), GSAP + ScrollTrigger (hero cinematic sequence, pinned Process Strip, section-handoff choreography), react-three-fiber/Three.js for true 3D elements (vacuum chamber model, particle systems) where feasible — otherwise equivalent depth via layered CSS 3D transforms, parallax, and particle canvases.
- `react-parallax-tilt` (or custom pointer-based tilt) for card/CTA hover depth.
- Build the hero as a component that accepts a swappable video/GIF asset (`heroMediaSrc`) with poster-frame fallback, so the final produced clip can be dropped in without code changes.
- Fully responsive; gracefully simplify the hero and section-transition complexity on mobile (shorter sequence, tap-to-flip cards, lighter particle counts).
- Performance: lazy-load heavy animation assets, use `will-change`/GPU-accelerated transforms only, and always provide the `prefers-reduced-motion` fallback described above.
- Global color system as CSS variables (ice-blue, frost-white, forest-green, spice-orange) so branding can be refined later.
