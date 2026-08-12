import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// Gesture definitions for letters A to Z in ASL finger-spelling

// Letter A
const aSign = new GestureDescription('A');
// Thumb: extended (not curled), other fingers: curled into a fist
aSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
aSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
// Optional: thumb pointing upwards
aSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.75);
aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.25);

// Letter B
const bSign = new GestureDescription('B');
// Four fingers extended straight, thumb curled across palm
bSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
bSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
bSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
// Fingers pointing up
bSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75);
bSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);
bSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);
bSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.75);

// Letter C
const cSign = new GestureDescription('C');
// All fingers and thumb curled into a semi-circle shape
cSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
cSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
// (Optional: no specific direction, shape is defined by curl)

// Letter D
const dSign = new GestureDescription('D');
// Index finger pointed up, other fingers in a circle (like an 'o')
dSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// Index pointing up
dSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
dSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.2);

// Letter E
const eSign = new GestureDescription('E');
// All fingers curled (thumb touches the tips of other fingers)
eSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
eSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
eSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
eSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
eSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);

// Letter F
const fSign = new GestureDescription('F');
// Thumb and index finger touch to form a circle, other fingers up
fSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
fSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
fSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
fSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
fSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
// Index & thumb forming circle might be oriented upward
fSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.5);
fSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.5);

// Letter G
const gSign = new GestureDescription('G');
// Index and thumb extended (as if pointing sideways), other fingers in fist
gSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
gSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
gSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
// Index and thumb pointing horizontally
gSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.8);
gSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.8);
gSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.2);
gSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.2);

// Letter H
const hSign = new GestureDescription('H');
// Index and middle fingers extended (pointing sideways), others in fist
hSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
hSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
hSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
hSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
hSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// Index and middle pointing horizontally
hSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.8);
hSign.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.8);

// Letter I
const iSign = new GestureDescription('I');
// Pinky finger extended (pointing up), others in a fist
iSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
iSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);

// Letter J
const jSign = new GestureDescription('J');
// Pinky finger extended (same as I), but we will allow a downward curve motion
jSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
jSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
jSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
jSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
jSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// Pinky (as drawing J) -- allow diagonal down direction
jSign.addDirection(Finger.Pinky, FingerDirection.DiagonalDownLeft, 1.0);

// Letter K
const kSign = new GestureDescription('K');
// Index and middle extended (spreading apart), thumb extended, others curled
kSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
kSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
kSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
kSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
kSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// Index and middle pointing up (forming a "V"), thumb points slightly sideways
kSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75);
kSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);

// Letter L
const lSign = new GestureDescription('L');
// Index and thumb extended to form an 'L', others curled
lSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
lSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
lSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
// Index up, thumb pointing sideways
lSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.9);
lSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);

// Letter M
const mSign = new GestureDescription('M');
// All fingers curled into a fist, thumb tucked under index, middle, ring fingers
mSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// (Thumb is hidden under three fingers - not explicitly detectable via Fingerpose)

// Letter N
const nSign = new GestureDescription('N');
// All fingers curled into a fist, thumb tucked under index and middle fingers
nSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// (Thumb is hidden under two fingers - not explicitly detectable via Fingerpose)

// Letter O
const oSign = new GestureDescription('O');
// All fingers and thumb curled to touch, forming an "O" shape
oSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
oSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
oSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
oSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
oSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
// (All fingertips meet - Fingerpose captures as all fingers half curled)

// Letter P
const pSign = new GestureDescription('P');
// Like K (index, middle, thumb extended) but pointing downward
pSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
pSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
pSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
pSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
pSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// Index and middle pointing downwards
pSign.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.8);
pSign.addDirection(Finger.Middle, FingerDirection.DiagonalDownLeft, 0.8);

// Letter Q
const qSign = new GestureDescription('Q');
// Like G (index and thumb extended) but pointing downward
qSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
qSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
qSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
qSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
qSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
// Index and thumb pointing diagonally down
qSign.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.8);
qSign.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.8);

// Letter R
const rSign = new GestureDescription('R');
// Index and middle fingers crossed (treated as both extended for pose)
rSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
rSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
rSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
rSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
rSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// (No reliable direction difference from U using Fingerpose)

// Letter S
const sSign = new GestureDescription('S');
// Fist with thumb curled across the outside of fingers
sSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// (Thumb lies across the front of the fingers)

// Letter T
const tSign = new GestureDescription('T');
// Fist with thumb tucked between index and middle fingers
tSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
tSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
tSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
tSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
tSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// (Thumb between index and middle)

// Letter U
const uSign = new GestureDescription('U');
// Index and middle fingers together extended, others in fist
uSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
uSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
uSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
uSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
uSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// Fingers pointing up
uSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
uSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);

// Letter V
const vSign = new GestureDescription('V');
// Index and middle fingers spread in a 'V', others in fist
vSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
vSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
vSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
vSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
vSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// Index and middle pointing up (slightly apart)
vSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
vSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);

// Letter W
const wSign = new GestureDescription('W');
// Index, middle, ring fingers extended (forming a W), pinky curled
wSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
wSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
wSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// Three extended fingers pointing up
wSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
wSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);
wSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.8);

// Letter X
const xSign = new GestureDescription('X');
// Index finger bent (hook), others in fist
xSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
xSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
xSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
xSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
xSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// (Index finger makes a hook shape)

// Letter Y
const ySign = new GestureDescription('Y');
// Thumb and pinky extended (like "Y"), others curled
ySign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
ySign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
ySign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
ySign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
ySign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
// Thumb points sideways, pinky points up
ySign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.8);
ySign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.8);

// Letter Z
const zSign = new GestureDescription('Z');
// Index finger extended (to "draw" Z), others curled
zSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
zSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
zSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
zSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
zSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
// Index finger points horizontally (as if starting to draw a Z)
zSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.7);
zSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.3);

// Export all gesture descriptions
const Gestures = {
  aSign, bSign, cSign, dSign, eSign, fSign, gSign, hSign, iSign, jSign,
  kSign, lSign, mSign, nSign, oSign, pSign, qSign, rSign, sSign, tSign,
  uSign, vSign, wSign, xSign, ySign, zSign
};

export default Gestures;
