/*CORE-START*/
function createWorld(THREE, opts) {
  var SP = opts.spacing || 2.4, OS = opts.objStep || 1;
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }
  function fbm(x, y) { var s = 0, a = 0.5, f = 1; for (var o = 0; o < 4; o++) { s += a * vnoise(x * f, y * f); a *= 0.5; f *= 2; } return s / 0.9375; }
  var seed = 11; function rand() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var r = Math.imul(seed ^ seed >>> 15, 1 | seed); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }

  /* ---- sites: route order follows the approved sector route 001 to 007 ---- */
  var AZ = Math.PI * 1.5;
  var SITES = [
    { code: 'tech', x: 40, z: 12, th: 60, dist: 225, h: -18, az: 3.95, fy: 0, pad: 110 },
    { code: 'data', x: 170, z: 60, th: 16, dist: 258, h: 66, az: 2.3, fy: 4, pad: 120, ox: -6, oz: -22 },
    { code: 'trading', x: -185, z: -130, th: 14, dist: 545, h: 198, az: 2.12, fy: 4, pad: 150, ox: -100, oz: -40 },
    { code: 'fisheries', x: -520, z: 50, th: 8, dist: 280, h: 82, az: 1.92, fy: 6, pad: 0 },
    { code: 'health', x: 440, z: -60, th: 8, dist: 395, h: 92, az: 3.92, fy: 8, pad: 130, ox: 0, oz: 2 },
    { code: 'agri', x: -215, z: 345, th: 34, dist: 410, h: 125, az: 3.2, fy: -6, pad: 0, ox: 52, oz: -40 },
    { code: 'fnb', x: 378, z: 242, th: 36, dist: 285, h: 22, az: 3.75, fy: 4, pad: 125 }
  ];
  var CITY = [780, 570];
  var PAD_Y = 8;
  function coast(z) { return -330 + (vnoise(z * 0.008, 5.1) - 0.5) * 120; }
  var PEAKS = [[-40, 595, 340, 185], [45, 545, 318, 150], [-215, 705, 270, 160], [135, 690, 300, 170], [70, 455, 205, 130], [-245, 500, 200, 140], [235, 520, 170, 140], [-90, 810, 225, 160], [300, 720, 150, 150]];
  function wMount(x, z) { return sstep(190, 520, z) * (1 - sstep(250, 620, x)) * sstep(coast(z) + 20, coast(z) + 260, x); }
  function wLow(x, z) { return sstep(330, 520, x) * sstep(300, 420, z) * (1 - sstep(800, 880, z)); }
  /* farm terraces follow the land: inside the farm area the ground is stepped along its own contours */
  var TSTEP = 6;
  /* the farm follows the flank: a band of land from the lowland floor up to the lower mountain slope, with no hard outline */
  function wAgriH(x, z, h) { var a = SITES[5], r = (1 - sstep(200, 275, Math.abs(x - a.x))) * (1 - sstep(165, 225, Math.abs(z - (a.z - 70)))); if (r <= 0) { return 0; } var cz0 = coast(z); return r * (1 - sstep(105, 150, h)) * sstep(cz0 + 70, cz0 + 150, x); }
  function wAgri(x, z) { var h = groundS(x, z); return h < 0 ? 0 : wAgriH(x, z, h); }
  function ground(x, z) { var h = groundS(x, z); if (h < 0) { return h; } var w = wAgriH(x, z, h); if (w > 0) { h = h * (1 - w) + (Math.floor(h / TSTEP) * TSTEP + 2) * w; } return h; }
  function groundS(x, z) {
    if (x < coast(z)) {
      var fx = x + 520, fz = z - 50; if (x > -640 || fx * fx + fz * fz < 250 * 250) { return -1; }
      var isl = Math.max(0, fbm(x * 0.009 + 9, z * 0.009 + 4) * 70 - 43); return isl > 0 ? isl * 1.5 : -1;
    }
    var h = 5 + fbm(x * 0.004 + 3, z * 0.004 + 7) * 22;
    var wm = wMount(x, z);
    if (wm > 0) {
      /* a range of rounded massifs joined by saddles, then spurs, secondary ridges and gullies cut into the slopes */
      var wx = x + (fbm(x * 0.0035 + 11, z * 0.0035 + 3) - 0.5) * 90, wz = z + (fbm(x * 0.0035 + 31, z * 0.0035 + 17) - 0.5) * 90, sm = 0, KS = 36;
      for (var k = 0; k < PEAKS.length; k++) { var pk = PEAKS[k], d2 = (wx - pk[0]) * (wx - pk[0]) + (wz - pk[1]) * (wz - pk[1]); sm += Math.exp(pk[2] * Math.exp(-d2 / (pk[3] * pk[3])) / KS); }
      var body = KS * Math.log(sm) - KS * Math.log(PEAKS.length);
      body *= 0.84 + 0.3 * fbm(x * 0.005 + 5, z * 0.005 + 9);
      var up = sstep(18, 170, body), rsum = 0, ra = 62, rf = 0.0062;
      for (var o = 0; o < 3; o++) { var nn = vnoise(wx * rf + 20 + o * 7, wz * rf + o * 13), rg = 1 - Math.abs(2 * nn - 1); rsum += ra * rg * rg * (3 - 2 * rg); ra *= 0.5; rf *= 2.1; }
      body += (rsum - 46) * up * (1 - 0.75 * sstep(215, 330, body)) - Math.abs(fbm(x * 0.021 + 9, z * 0.021 + 4) - 0.5) * 46 * up + (fbm(x * 0.05, z * 0.05) - 0.5) * 9 * up;
      h += wm * Math.max(0, body); }
    if (z > 860) { h += 190 * Math.pow(fbm(x * 0.0022 + 3, z * 0.0022 + 8), 2) * sstep(860, 1250, z) * sstep(coast(z) + 40, coast(z) + 300, x); }
    var wl = wLow(x, z); if (wl > 0) { h = h * (1 - wl) + (7 + fbm(x * 0.0065 + 40, z * 0.0065) * 44 + fbm(x * 0.021 + 3, z * 0.021) * 9) * wl; }
    var dcx = x - CITY[0], dcz = z - CITY[1], wc = 1 - sstep(140, 240, Math.sqrt(dcx * dcx + dcz * dcz)); if (wc > 0) { h = h * (1 - wc) + PAD_Y * wc; }
    h *= sstep(coast(z), coast(z) + 80, x);
    for (var i = 0; i < SITES.length; i++) {
      var s = SITES[i]; if (!s.pad) { continue; }
      var d = Math.sqrt((x - s.x) * (x - s.x) + (z - s.z) * (z - s.z));
      var w = 1 - sstep(s.pad * 0.7, s.pad * 1.25, d); h = h * (1 - w) + PAD_Y * w;
    }
    return h;
  }

  var P = [], R = [], M = [];
  var FLAG = -1;
  function put(x, y, z, site, flag, r0) { if (FLAG >= 0 && site === 0) { flag = FLAG; } P.push(x, y, z); R.push(r0 === undefined ? rand() * 2 - 1 : r0, rand() * 2 - 1, rand() * 2 - 1); M.push(site, flag); }

  /* ---- terrain: each zone is drawn with its own point pattern so the change of scenery reads at a glance ---- */
  var X0 = -900, X1 = 1150, Z0 = -600, Z1 = 900, ix, iz;
  for (iz = 0; Z0 + iz * SP <= Z1; iz++) {
    for (ix = 0; X0 + ix * SP <= X1; ix++) {
      var x = X0 + ix * SP, z = Z0 + iz * SP, eg = Math.min(x - X0, X1 - x, z - Z0, Z1 - z);
      if (eg < 280 && rand() > 0.16 + 0.84 * (eg / 280)) { continue; }
      var g = ground(x, z);
      if (g < 0) { if (ix % 2 === 0) { put(x, 0, z, 0, 2); } continue; }
              /* sea: wave crests running along the shore */
      var cd = x - coast(z);
      if (cd < 26) { put(x, g, z, 0, 4); put(x + (rand() - 0.5) * SP, g, z + (rand() - 0.5) * SP, 0, 4); put(x + (rand() - 0.5) * SP, g, z + (rand() - 0.5) * SP, 0, 4); continue; } /* beach: dense bright band */
      put(x, g, z, 0, 0);
    }
  }
  /* surrounding land and sea in three coarser bands; distance haze, not a border, is what ends the view */
  [[0, 350, 2.5, 0.35], [350, 850, 4.2, 0.39], [850, 1500, 6.7, 0.3]].forEach(function (band) { var st = SP * band[2], ax0 = X0 - band[1], ax1 = X1 + band[1], az0 = Z0 - band[1], az1 = Z1 + band[1], n = 0, wd = band[1] - band[0];
    for (var rz = az0; rz <= az1; rz += st) { for (var rx = ax0; rx <= ax1; rx += st) {
      if (rx > X0 - band[0] && rx < X1 + band[0] && rz > Z0 - band[0] && rz < Z1 + band[0]) { continue; }
      var out = Math.min(rx - ax0, ax1 - rx, rz - az0, az1 - rz) / wd; if (out < 0.5 && rand() > band[3] + (1 - band[3]) * (out / 0.5)) { continue; }
      var jx = rx + (rand() - 0.5) * st * 0.95, jz = rz + (rand() - 0.5) * st * 0.95, rg = ground(jx, jz); n++;
      if (rg < 0) { if (n % 2 === 0) { put(jx, 0, jz, 0, 2); } } else { put(jx, rg, jz, 0, 0); } } } });
  /* one set of contour lines for all land: the same levels run from the summits through the farm terraces and foothills into the lowlands, so nothing breaks between them.
     Lines are bright where there is relief (mountain, farm, lowland) and faint elsewhere; brightness changes along a line, the line itself does not stop. */
  var CI = 6;
  function contours(x0, x1, z0, z1, st, keep) {
    for (var cz = z0; cz <= z1; cz += st) { for (var cx = x0; cx <= x1; cx += st) { if (keep && !keep(cx, cz)) { continue; } var hs = groundS(cx, cz); if (hs < 0) { continue; }
      var f6 = hs / CI - Math.floor(hs / CI); if (f6 >= 0.125) { continue; }
      var wm = wMount(cx, cz), wa = wAgriH(cx, cz, hs), wl = wLow(cx, cz), dcc = Math.sqrt((cx - CITY[0]) * (cx - CITY[0]) + (cz - CITY[1]) * (cz - CITY[1]));
      var y = wa > 0 ? hs * (1 - wa) + (Math.floor(hs / TSTEP) * TSTEP + 2) * wa + 0.6 : hs;
      var ha = groundS(cx + 0.8, cz), hb = groundS(cx, cz + 0.8); if (ha < 0) { ha = hs; } if (hb < 0) { hb = hs; }
      var gr = Math.sqrt((ha - hs) * (ha - hs) + (hb - hs) * (hb - hs)) / 0.8; if (f6 * CI > gr * st * 0.25) { continue; }
      put(cx, y, cz, 0, 7); } } }
  /* point spacing along the lines: 1.2 units in the north, 1.8 in the south, in the lowlands between the mountains and the city, and in the land just outside the detailed area */
  contours(X0, X1, 170, Z1, SP * 0.5, function (x, z) { return wLow(x, z) <= 0.5; });
  contours(X0, X1, Z0, 170 - SP * 0.75, SP * 0.75);
  contours(300, X1, 280, Z1, SP * 0.75, function (x, z) { return wLow(x, z) > 0.5; });
  var OUTW = 350;
  contours(X0 - OUTW, X1 + OUTW, Z0 - OUTW, Z1 + OUTW, SP * 0.75, function (x, z) { if (x >= X0 && x <= X1 && z >= Z0 && z <= Z1) { return false; }
    var out = Math.max(X0 - x, x - X1, Z0 - z, z - Z1); return rand() < 1 - out / OUTW; });
  for (var ci = 0; ci < 170; ci++) { var ccx = 330 + hash(ci * 1.37, 2.1) * 560, ccz = 300 + hash(ci * 2.11, 7.3) * 570, dcy = Math.sqrt((ccx - CITY[0]) * (ccx - CITY[0]) + (ccz - CITY[1]) * (ccz - CITY[1]));
    if (wLow(ccx, ccz) < 0.6 || dcy < 225) { continue; } var cr = 7 + hash(ci, 4.4) * 13, cn = Math.round(cr * 3.2 / OS);
    for (var cj = 0; cj < cn; cj++) { var ca2 = rand() * Math.PI * 2, cd2 = Math.sqrt(rand()) * cr, tx2 = ccx + Math.cos(ca2) * cd2, tz2 = ccz + Math.sin(ca2) * cd2; put(tx2, ground(tx2, tz2) + 1.5 + rand() * 6 * (1 - cd2 / cr), tz2, 0, 0); } }
  for (var rv = 0; rv <= 1; rv += 0.0016 * OS) { var rvx = 350 + rv * 300, rvz = 800 - rv * 430 + Math.sin(rv * 9) * 46 + Math.sin(rv * 23) * 14, rg2 = ground(rvx, rvz);
    if (rg2 >= 0) { put(rvx, rg2 + 0.3, rvz - 3.5, 0, 7); put(rvx, rg2 + 0.3, rvz + 3.5, 0, 7); if (Math.round(rv * 1000) % 3 === 0) { put(rvx, rg2, rvz, 0, 2); } } }

  /* ---- primitives (all in world units, step scaled for lighter devices) ---- */
  function line(x0, y0, z0, x1, y1, z1, st, site, flag) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0) + (z1 - z0) * (z1 - z0)), n = Math.max(1, Math.round(d / (st * OS)));
    for (var i = 0; i <= n; i++) { var t = i / n; put(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t, site, flag || 0); }
  }
  function box(cx, y0, cz, w, h, d, st, site, roof) {
    var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, y, s = st * OS;
    for (y = y0; y < y0 + h - 0.01; y += s) { line(x0, y, z0, x1, y, z0, st, site); line(x0, y, z1, x1, y, z1, st, site); line(x0, y, z0, x0, y, z1, st, site); line(x1, y, z0, x1, y, z1, st, site); }
    var t = y0 + h; line(x0, t, z0, x1, t, z0, st, site, 1); line(x0, t, z1, x1, t, z1, st, site, 1); line(x0, t, z0, x0, t, z1, st, site, 1); line(x1, t, z0, x1, t, z1, st, site, 1);
    if (roof) { for (var zz = z0 + s; zz < z1; zz += s * 1.6) { line(x0, t, zz, x1, t, zz, st * 1.6, site); } }
  }
  function frameBox(cx, y0, cz, w, h, d, st, site) {
    var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, t = y0 + h;
    [[x0, z0], [x1, z0], [x0, z1], [x1, z1]].forEach(function (c) { line(c[0], y0, c[1], c[0], t, c[1], st, site); });
    [y0, t].forEach(function (y) { var f = y === t ? 1 : 0; line(x0, y, z0, x1, y, z0, st, site, f); line(x0, y, z1, x1, y, z1, st, site, f); line(x0, y, z0, x0, y, z1, st, site, f); line(x1, y, z0, x1, y, z1, st, site, f); });
  }
  function ring(cx, y, cz, r, st, site, flag) { var n = Math.max(8, Math.round(2 * Math.PI * r / (st * OS))); for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; put(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, site, flag || 0); } }
  function cyl(cx, y0, cz, r, h, st, site, cone) {
    for (var y = y0; y < y0 + h - 0.01; y += st * OS) { ring(cx, y, cz, r, st, site); }
    ring(cx, y0 + h, cz, r, st, site, 1);
    if (cone) { for (var k = 1; k < 5; k++) { ring(cx, y0 + h + cone * k / 5, cz, r * (1 - k / 5), st, site); } }
  }
  function tunnel(cx, y0, cz, len, r, st, site) {
    for (var z = cz - len / 2; z <= cz + len / 2 + 0.01; z += st * OS * 1.5) {
      var n = Math.max(6, Math.round(Math.PI * r / (st * OS))), end = (z <= cz - len / 2 + 0.01 || z >= cz + len / 2 - st * OS * 1.5);
      for (var i = 0; i <= n; i++) { var a = i / n * Math.PI; put(cx + Math.cos(a) * r, y0 + Math.sin(a) * r, z, site, (i === Math.round(n / 2) || end) ? 1 : 0); }
    }
  }
  function dish(cx, cy, cz, r, st, site, yaw, pitch) {
    for (var rr = st; rr <= r + 0.01; rr += st * OS) {
      var n = Math.max(8, Math.round(2 * Math.PI * rr / (st * OS)));
      for (var i = 0; i < n; i++) {
        var a = i / n * Math.PI * 2, lx = Math.cos(a) * rr, ly = Math.sin(a) * rr, lz = rr * rr / (r * 1.6);
        var y1 = ly * Math.cos(pitch) + lz * Math.sin(pitch), z1 = -ly * Math.sin(pitch) + lz * Math.cos(pitch);
        var x2 = lx * Math.cos(yaw) + z1 * Math.sin(yaw), z2 = -lx * Math.sin(yaw) + z1 * Math.cos(yaw);
        put(cx + x2, cy + y1, cz + z2, site, rr > r - st * OS ? 1 : 0);
      }
    }
  }
  function tower(cx, y0, cz, h, b0, b1, st, site) {
    var lv = 9, i, k;
    function corner(k, t) { var b = b0 + (b1 - b0) * t, sx = (k === 0 || k === 3) ? -1 : 1, sz = k < 2 ? -1 : 1; return [cx + sx * b, y0 + h * t, cz + sz * b]; }
    for (k = 0; k < 4; k++) { var a = corner(k, 0), b = corner(k, 1); line(a[0], a[1], a[2], b[0], b[1], b[2], st, site, 1); }
    for (i = 0; i <= lv; i++) { for (k = 0; k < 4; k++) { var c = corner(k, i / lv), d = corner((k + 1) % 4, i / lv); line(c[0], c[1], c[2], d[0], d[1], d[2], st, site);
      if (i < lv) { var e = corner((k + 1) % 4, (i + 1) / lv); line(c[0], c[1], c[2], e[0], e[1], e[2], st * 1.3, site); } } }
    line(cx, y0 + h, cz, cx, y0 + h + 26, cz, st, site, 1);
  }

  /* ---- 001 Technology & Digitalization: one operations building, a parabolic antenna and a tower, as before, in more detail ---- */
  var s = SITES[0];
  (function () { var P0 = PAD_Y, i, a, y, TX = s.x - 18, TZ = s.z, TH = 150;
    function tw(h) { return 13 + (2.5 - 13) * h / TH; }
    /* tower: the same lattice mast, plus a central core, three service platforms with railings, light rings, sector antennas, relay drums and a beacon */
    tower(TX, P0, TZ, TH, 13, 2.5, 1.5, 1);
    for (y = 0; y <= TH; y += 2.4) { put(TX, P0 + y, TZ, 1, 0); put(TX + 0.9, P0 + y, TZ, 1, 0); put(TX - 0.9, P0 + y, TZ, 1, 0); }
    [48, 90, 126].forEach(function (h) { var b = tw(h) + 3.2;
      [0, 2.6].forEach(function (dy) { line(TX - b, P0 + h + dy, TZ - b, TX + b, P0 + h + dy, TZ - b, 0.9, 1, dy ? 0 : 1); line(TX - b, P0 + h + dy, TZ + b, TX + b, P0 + h + dy, TZ + b, 0.9, 1, dy ? 0 : 1); line(TX - b, P0 + h + dy, TZ - b, TX - b, P0 + h + dy, TZ + b, 0.9, 1, dy ? 0 : 1); line(TX + b, P0 + h + dy, TZ - b, TX + b, P0 + h + dy, TZ + b, 0.9, 1, dy ? 0 : 1); });
      for (a = -b; a <= b + 0.01; a += b / 2) { line(TX + a, P0 + h, TZ - b, TX + a, P0 + h, TZ + b, 1.5, 1); } });
    [24, 68, 108, 140].forEach(function (h) { ring(TX, P0 + h, TZ, tw(h) * 1.42 + 0.8, 0.8, 1, 1); });
    for (i = 0; i < 6; i++) { var an = i / 6 * Math.PI * 2, rx = TX + Math.cos(an) * 5.4, rz = TZ + Math.sin(an) * 5.4; line(rx, P0 + 128, rz, rx, P0 + 142, rz, 0.8, 1); line(rx + Math.cos(an) * 0.9, P0 + 128, rz + Math.sin(an) * 0.9, rx + Math.cos(an) * 0.9, P0 + 142, rz + Math.sin(an) * 0.9, 0.8, 1); }
    [[72, 1], [72, -1], [100, 1], [112, -1]].forEach(function (d) { var h = d[0], ox = (tw(h) + 2.2) * d[1]; for (i = 0; i < 16; i++) { var t = i / 16 * Math.PI * 2; put(TX + ox, P0 + h + Math.sin(t) * 3.6, TZ + Math.cos(t) * 3.6, 1, 1); put(TX + ox + d[1] * 1.6, P0 + h + Math.sin(t) * 3.6, TZ + Math.cos(t) * 3.6, 1, 0); } put(TX + ox, P0 + h, TZ, 1, 0); });
    line(TX, P0 + TH, TZ, TX, P0 + TH + 30, TZ, 0.9, 1, 1); ring(TX, P0 + TH + 12, TZ, 1.6, 0.8, 1, 1); ring(TX, P0 + TH + 22, TZ, 1.1, 0.8, 1, 1); for (i = 0; i < 5; i++) { put(TX, P0 + TH + 30 + i * 0.5, TZ, 1, 1); }
    line(TX + 10, P0 + 21, TZ + 2, s.x + 4, P0 + 21, s.z + 4, 1.0, 1); line(TX + 10, P0 + 21, TZ + 2, TX + 10, P0, TZ + 2, 1.2, 1);                 /* cable bridge to the building */
    /* operations building: podium and a set-back upper level, both with vertical fins and lit parapets, roof plant, radomes and a solar array */
    box(s.x + 34, P0, s.z + 6, 74, 12, 46, 1.9, 1, true);
    box(s.x + 30, P0 + 12, s.z + 6, 50, 10, 28, 1.9, 1, true);
    for (a = -37; a <= 37; a += 3.7) { line(s.x + 34 + a, P0, s.z - 17.4, s.x + 34 + a, P0 + 12, s.z - 17.4, 1.3, 1, Math.round(a / 3.7) % 4 === 0 ? 1 : 0); }
    for (a = -23; a <= 23; a += 4.6) { line(s.x - 3.4, P0, s.z + 6 + a, s.x - 3.4, P0 + 12, s.z + 6 + a, 1.3, 1); }
    for (a = -25; a <= 25; a += 3.6) { line(s.x + 30 + a, P0 + 12, s.z - 8.4, s.x + 30 + a, P0 + 22, s.z - 8.4, 1.3, 1); }
    line(s.x - 3, P0 + 6.2, s.z - 17.4, s.x + 71, P0 + 6.2, s.z - 17.4, 0.8, 1, 1); line(s.x - 3.4, P0 + 6.2, s.z - 17, s.x - 3.4, P0 + 6.2, s.z + 29, 0.8, 1, 1);
    [[14, 0], [26, 0], [38, 2]].forEach(function (c) { frameBox(s.x + c[0], P0 + 22, s.z + 12 + c[1], 8, 3.4, 7, 1.0, 1); });                           /* roof plant */
    [[64, 24, 4.6], [64, -10, 3.4]].forEach(function (c) { for (i = 0; i <= 5; i++) { var el = i / 5 * Math.PI / 2; ring(s.x + c[0], P0 + 12 + Math.sin(el) * c[2], s.z + c[1], Math.cos(el) * c[2] + 0.01, 0.9, 1, i === 0 ? 1 : 0); } });   /* radomes */
    for (i = 0; i < 4; i++) { var pz = s.z - 12 + i * 6.4; line(s.x + 2, P0 + 12.4, pz, s.x + 24, P0 + 12.4, pz, 1.0, 1); line(s.x + 2, P0 + 15, pz + 3.4, s.x + 24, P0 + 15, pz + 3.4, 1.0, 1, 1); for (a = 2; a <= 24; a += 5.5) { line(s.x + a, P0 + 12.4, pz, s.x + a, P0 + 15, pz + 3.4, 1.2, 1); } }   /* solar array */
    line(s.x + 71, P0 + 8.5, s.z - 17.4, s.x + 71, P0 + 8.5, s.z - 26, 0.9, 1, 1); line(s.x + 60, P0 + 8.5, s.z - 26, s.x + 71, P0 + 8.5, s.z - 26, 0.9, 1, 1); line(s.x + 60, P0, s.z - 26, s.x + 60, P0 + 8.5, s.z - 26, 1.1, 1); line(s.x + 71, P0, s.z - 26, s.x + 71, P0 + 8.5, s.z - 26, 1.1, 1);   /* entrance canopy */
    /* parabolic antenna on the upper roof: pedestal and yoke, ribbed reflector, tripod feed with a sub-reflector */
    var DX = s.x + 44, DY = P0 + 43, DZ = s.z + 8, DR = 20, yaw = 3.5, pit = 0.75;
    function tf(lx, ly, lz) { var y1 = ly * Math.cos(pit) + lz * Math.sin(pit), z1 = -ly * Math.sin(pit) + lz * Math.cos(pit); return [DX + lx * Math.cos(yaw) + z1 * Math.sin(yaw), DY + y1, DZ - lx * Math.sin(yaw) + z1 * Math.cos(yaw)]; }
    function pl(a1, b1, st, fl) { line(a1[0], a1[1], a1[2], b1[0], b1[1], b1[2], st, 1, fl || 0); }
    cyl(DX, P0 + 22, DZ, 3.2, 12, 1.2, 1, 0); line(DX - 5, P0 + 34, DZ, DX + 5, P0 + 34, DZ, 0.9, 1, 1); line(DX - 5, P0 + 34, DZ, DX - 5, DY - 1, DZ, 0.9, 1); line(DX + 5, P0 + 34, DZ, DX + 5, DY - 1, DZ, 0.9, 1);
    function depth(rr) { return rr * rr / (DR * 1.6); }
    for (var rr = 2; rr <= DR + 0.01; rr += 2) { var nn = Math.max(10, Math.round(2 * Math.PI * rr / 1.15)), rim = rr > DR - 0.1 || Math.abs(rr - DR * 0.5) < 1.01; for (i = 0; i < nn; i++) { var t2 = i / nn * Math.PI * 2, w = tf(Math.cos(t2) * rr, Math.sin(t2) * rr, depth(rr)); put(w[0], w[1], w[2], 1, rim ? 1 : 0); } }
    for (i = 0; i < 16; i++) { var t3 = i / 16 * Math.PI * 2; pl(tf(Math.cos(t3) * 2, Math.sin(t3) * 2, depth(2)), tf(Math.cos(t3) * DR, Math.sin(t3) * DR, depth(DR)), 1.0); }
    var foc = tf(0, 0, DR * 0.62); for (i = 0; i < 3; i++) { var t4 = i / 3 * Math.PI * 2 + 0.5; pl(tf(Math.cos(t4) * DR * 0.94, Math.sin(t4) * DR * 0.94, depth(DR * 0.94)), foc, 0.9); }
    for (i = 0; i < 14; i++) { var t5 = i / 14 * Math.PI * 2, sr = tf(Math.cos(t5) * 2.6, Math.sin(t5) * 2.6, DR * 0.62); put(sr[0], sr[1], sr[2], 1, 1); } pl(tf(0, 0, depth(0)), tf(0, 0, DR * 0.2), 0.8, 1); })();

  /* ---- 002 Data & Business Intelligence: three detailed data halls with their plant, and one low cylindrical business office ---- */
  s = SITES[1];
  (function () { var P0 = PAD_Y, i, a, y, k;
    /* business office: a low glazed drum, floor by floor, with a ground-level canopy ring and a roof terrace */
    var ox = s.x - 2, oz = s.z + 46, R = 17, OH = 40;
    for (y = 0; y <= OH + 0.01; y += 4) { ring(ox, P0 + y, oz, R, 1.15, 2, (Math.round(y / 4) % 3 === 0 || y > OH - 0.1) ? 1 : 0); }
    for (i = 0; i < 28; i++) { var an = i / 28 * Math.PI * 2; line(ox + Math.cos(an) * R, P0, oz + Math.sin(an) * R, ox + Math.cos(an) * R, P0 + OH, oz + Math.sin(an) * R, 1.5, 2); }
    ring(ox, P0 + 5, oz, R + 5, 1.0, 2, 1); ring(ox, P0 + 5, oz, R + 2.5, 1.4, 2); for (i = 0; i < 10; i++) { var a2 = i / 10 * Math.PI * 2; line(ox + Math.cos(a2) * (R + 5), P0, oz + Math.sin(a2) * (R + 5), ox + Math.cos(a2) * (R + 5), P0 + 5, oz + Math.sin(a2) * (R + 5), 1.3, 2); }
    ring(ox, P0 + OH, oz, R - 4, 1.2, 2); ring(ox, P0 + OH + 2.4, oz, R - 4, 1.0, 2, 1); ring(ox, P0 + OH, oz, 6, 1.2, 2); cyl(ox, P0 + OH, oz, 3, 5, 1.1, 2, 0); line(ox, P0 + OH + 5, oz, ox, P0 + OH + 14, oz, 0.9, 2, 1);
    /* three data halls: solid walls with a status band, rows of roof coolers with fan rings, a ridge duct, louvred sides and a plant block with exhausts */
    [-8, -42, -76].forEach(function (dz, hi) { var hx = s.x + 4, hz = s.z + dz, HW = 88, HH = 13, HD = 24;
      box(hx, P0, hz, HW, HH, HD, 2.0, 2, true);
      line(hx - HW / 2, P0 + 6.5, hz - HD / 2 - 0.3, hx + HW / 2, P0 + 6.5, hz - HD / 2 - 0.3, 0.8, 2, 1); line(hx + HW / 2 + 0.3, P0 + 6.5, hz - HD / 2, hx + HW / 2 + 0.3, P0 + 6.5, hz + HD / 2, 0.8, 2, 1);
      for (a = -HW / 2 + 4; a <= HW / 2 - 4; a += 3.2) { line(hx + a, P0 + 8.2, hz - HD / 2 - 0.3, hx + a, P0 + 11.6, hz - HD / 2 - 0.3, 1.1, 2); }                       /* louvres */
      for (k = 0; k < 7; k++) { [-6, 6].forEach(function (cz) { var cx = hx - 36 + k * 12; cyl(cx, P0 + HH, hz + cz, 3, 3, 1.1, 2, 0); ring(cx, P0 + HH + 3.2, hz + cz, 1.6, 0.8, 2, 1); }); }   /* coolers */
      line(hx - HW / 2 + 2, P0 + HH + 1.6, hz, hx + HW / 2 - 2, P0 + HH + 1.6, hz, 0.9, 2); line(hx - HW / 2 + 2, P0 + HH + 3, hz, hx + HW / 2 - 2, P0 + HH + 3, hz, 0.9, 2);                 /* ridge duct */
      box(hx - HW / 2 - 9, P0, hz, 12, 9, 16, 1.6, 2, true); [-4, 0, 4].forEach(function (e) { line(hx - HW / 2 - 9, P0 + 9, hz + e, hx - HW / 2 - 9, P0 + 19, hz + e, 0.9, 2, e === 0 ? 1 : 0); });                 /* generator block with exhausts */
      if (hi < 2) { [-24, 6, 30].forEach(function (bx) { line(hx + bx, P0 + 9, hz - HD / 2, hx + bx, P0 + 9, hz - HD / 2 - 10, 0.9, 2); line(hx + bx + 2, P0 + 9, hz - HD / 2, hx + bx + 2, P0 + 9, hz - HD / 2 - 10, 0.9, 2); }); } });   /* pipe bridges between halls */
    /* chiller yard and substation at the far end */
    for (i = 0; i < 4; i++) { cyl(s.x + 60, P0, s.z - 76 + i * 12, 4, 10, 1.3, 2, 2); }
    [[-14], [0], [14]].forEach(function (c) { frameBox(s.x + 62, P0, s.z - 14 + c[0], 8, 6, 8, 1.0, 2); line(s.x + 62, P0 + 6, s.z - 14 + c[0], s.x + 62, P0 + 13, s.z - 14 + c[0], 0.8, 2, 1); });
    line(s.x + 62, P0 + 13, s.z - 28, s.x + 62, P0 + 13, s.z, 0.9, 2); })();
  /* ---- 003 General Trading & Supply Chain, turned a quarter turn so the chain runs toward the sea:
          trucks and warehouse, container yard and rail, quay with ship-to-shore cranes, cargo ships on the water ---- */
  s = SITES[2];
  (function () { var i, j, k, a, y, P0 = PAD_Y, QY = 5.5;
    function wheelX(x, yy, z, r) { for (var w = 0; w < 12; w++) { var an = w / 12 * Math.PI * 2; put(x + Math.cos(an) * r, yy + Math.sin(an) * r, z, 3, 0); } put(x, yy, z, 3, 0); }
    /* warehouse with office, roof lights, seven dock doors on the landward face, canopy */
    box(s.x + 30, P0, s.z - 20, 40, 17, 112, 1.7, 3, true);
    box(s.x + 34, P0, s.z + 47, 32, 24, 22, 1.7, 3, true); line(s.x + 50, P0 + 12, s.z + 36, s.x + 50, P0 + 12, s.z + 58, 1.0, 3, 1);
    for (i = -40; i <= 40; i += 20) { frameBox(s.x + 30, P0 + 17, s.z - 20 + i, 14, 1.6, 8, 1.2, 3); }
    for (i = 0; i < 7; i++) { var dz = s.z - 68 + i * 14, fx = s.x + 50.5; line(fx, P0, dz - 3.8, fx, P0 + 10, dz - 3.8, 0.8, 3, 1); line(fx, P0, dz + 3.8, fx, P0 + 10, dz + 3.8, 0.8, 3, 1); line(fx, P0 + 10, dz - 3.8, fx, P0 + 10, dz + 3.8, 0.8, 3, 1); line(fx, P0 + 5, dz - 3.8, fx, P0 + 5, dz + 3.8, 1.2, 3); }
    line(s.x + 57, P0 + 12.5, s.z - 76, s.x + 57, P0 + 12.5, s.z + 34, 0.9, 3, 1); for (a = -76; a <= 34; a += 5.5) { line(s.x + 50, P0 + 12.5, s.z + a, s.x + 57, P0 + 12.5, s.z + a, 1.2, 3); }
    /* three articulated trucks backed onto the docks, cabs pointing inland */
    [0, 2, 5].forEach(function (d) { var tz = s.z - 68 + d * 14, x0 = s.x + 52, hw = 3.3;
      for (y = P0 + 3.2; y <= P0 + 12.01; y += 1.1) { line(x0, y, tz - hw, x0 + 26, y, tz - hw, 1.0, 3); line(x0, y, tz + hw, x0 + 26, y, tz + hw, 1.0, 3); line(x0 + 26, y, tz - hw, x0 + 26, y, tz + hw, 1.0, 3); }
      for (a = 0; a <= 26; a += 2.2) { line(x0 + a, P0 + 12, tz - hw, x0 + a, P0 + 12, tz + hw, 1.1, 3, a === 0 || a > 25 ? 1 : 0); }
      line(x0, P0 + 12, tz - hw, x0 + 26, P0 + 12, tz - hw, 0.9, 3, 1); line(x0, P0 + 12, tz + hw, x0 + 26, P0 + 12, tz + hw, 0.9, 3, 1);
      [-hw - 0.3, hw + 0.3].forEach(function (oz) { [4.5, 8.6, 24, 27.6, 35].forEach(function (o) { wheelX(x0 + o, P0 + 1.7, tz + oz, 1.7); }); });
      line(x0 + 20, P0 + 3, tz, x0 + 20, P0 + 0.4, tz, 0.9, 3);
      var pr = [[27.2, 1.4], [27.2, 11], [32.6, 11], [34.4, 7.4], [37.4, 6.6], [37.4, 1.4]];
      [-hw + 0.3, hw - 0.3].forEach(function (oz) { for (var q = 0; q < pr.length; q++) { var p1 = pr[q], p2 = pr[(q + 1) % pr.length]; line(x0 + p1[0], P0 + p1[1], tz + oz, x0 + p2[0], P0 + p2[1], tz + oz, 0.8, 3, q === 1 || q === 2 ? 1 : 0); }
        line(x0 + 27.6, P0 + 7.2, tz + oz, x0 + 33.6, P0 + 7.2, tz + oz, 0.9, 3); });
      [[27.2, 11], [32.6, 11], [34.4, 7.4], [37.4, 6.6], [37.4, 1.4], [37.4, 4]].forEach(function (p1) { line(x0 + p1[0], P0 + p1[1], tz - hw + 0.3, x0 + p1[0], P0 + p1[1], tz + hw - 0.3, 0.9, 3); });
      line(x0 + 27.4, P0 + 3, tz + hw - 0.2, x0 + 27.4, P0 + 14, tz + hw - 0.2, 0.9, 3, 1); });
    /* container yard on the seaward side of the warehouse, under one yard crane */
    for (j = 0; j < 3; j++) { for (i = 0; i < 4; i++) { var n = [[2, 1, 3, 1], [1, 2, 1, 2], [3, 1, 2, 1]][j][i], cx = s.x - 22 - j * 20, cz = s.z - 36 + i * 24;
      for (k = 0; k < n; k++) { box(cx, P0 + k * 6.8, cz, 6.6, 6.6, 17, 2.5, 3, false); } } }
    [-9, 9].forEach(function (oz) { [-12, -72].forEach(function (lx) { line(s.x + lx, P0, s.z + oz - 0.8, s.x + lx, P0 + 38, s.z + oz - 0.8, 0.9, 3); line(s.x + lx, P0, s.z + oz + 0.8, s.x + lx, P0 + 38, s.z + oz + 0.8, 0.9, 3); });
      line(s.x - 6, P0 + 38, s.z + oz, s.x - 78, P0 + 38, s.z + oz, 0.9, 3, 1); line(s.x - 6, P0 + 40.5, s.z + oz, s.x - 78, P0 + 40.5, s.z + oz, 0.9, 3, 1); });
    for (a = -78; a <= -6; a += 6) { line(s.x + a, P0 + 38, s.z - 9, s.x + a, P0 + 38, s.z + 9, 1.3, 3); }
    box(s.x - 42, P0 + 33.5, s.z, 8, 4.5, 10, 1.1, 3, true); line(s.x - 44, P0 + 33.5, s.z - 4, s.x - 44, P0 + 26.5, s.z - 4, 0.9, 3, 1); line(s.x - 40, P0 + 33.5, s.z + 4, s.x - 40, P0 + 26.5, s.z + 4, 0.9, 3, 1);
    box(s.x - 42, P0 + 19.5, s.z, 6.6, 6.6, 17, 2.4, 3, false);
    /* rail siding between the yard and the quay: locomotive and three loaded wagons */
    line(s.x - 86, P0 + 0.4, s.z - 74, s.x - 86, P0 + 0.4, s.z + 74, 1.2, 3); line(s.x - 90, P0 + 0.4, s.z - 74, s.x - 90, P0 + 0.4, s.z + 74, 1.2, 3);
    for (a = -74; a <= 74; a += 4) { line(s.x - 85, P0 + 0.3, s.z + a, s.x - 91, P0 + 0.3, s.z + a, 1.6, 3); }
    for (i = 0; i < 3; i++) { var wz = s.z - 30 + i * 34; box(s.x - 88, P0 + 2.8, wz, 6.2, 6.6, 26, 2.5, 3, false); }
    box(s.x - 88, P0 + 1.6, s.z - 62, 6.4, 9.5, 18, 1.3, 3, true);
    /* quay: a narrow deck drawn as an outline only, a single row of piles on the seaward edge, bollards */
    var qx0 = s.x - 100, qx1 = s.x - 146, qz0 = s.z - 84, qz1 = s.z + 84;
    line(qx0, QY, qz0, qx1, QY, qz0, 1.0, 3, 1); line(qx0, QY, qz1, qx1, QY, qz1, 1.0, 3, 1); line(qx1, QY, qz0, qx1, QY, qz1, 0.9, 3, 1); line(qx0, QY, qz0, qx0, QY, qz1, 1.4, 3);
    for (a = qz0; a <= qz1 + 0.01; a += 21) { line(qx1, QY, a, qx1, -2, a, 1.3, 3); line(qx1 + 1, QY, a, qx1 + 1, QY + 1.8, a, 0.7, 3, 1); }
    /* two slim ship-to-shore cranes: legs, A-frame and a boom out over the ship */
    [-44, 44].forEach(function (oz) { var cz = s.z + oz, lx0 = s.x - 112, lx1 = s.x - 140;
      [-7, 7].forEach(function (w) { line(lx0, QY, cz + w, lx0, QY + 46, cz + w, 0.9, 3); line(lx1, QY, cz + w, lx1, QY + 46, cz + w, 0.9, 3); });
      line(lx0, QY + 46, cz - 7, lx0, QY + 46, cz + 7, 1.0, 3); line(lx1, QY + 46, cz - 7, lx1, QY + 46, cz + 7, 1.0, 3); line(lx0, QY + 20, cz - 7, lx1, QY + 20, cz - 7, 1.3, 3); line(lx0, QY + 20, cz + 7, lx1, QY + 20, cz + 7, 1.3, 3);
      line(s.x - 100, QY + 46, cz, s.x - 204, QY + 46, cz, 0.85, 3, 1);
      line(lx1, QY + 46, cz, s.x - 126, QY + 66, cz, 0.9, 3, 1); line(lx0, QY + 46, cz, s.x - 126, QY + 66, cz, 0.9, 3, 1); line(s.x - 126, QY + 66, cz, s.x - 202, QY + 46, cz, 1.1, 3);
      line(s.x - 176, QY + 46, cz, s.x - 176, QY + 34, cz, 0.9, 3, 1); frameBox(s.x - 176, QY + 27, cz, 6.6, 6.6, 17, 1.0, 3); });
    /* cargo ships: tall hull drawn in close-set lines with a pointed bow, container bays on deck, bridge and funnel at the stern */
    function ship(cx, cz, len, beam, bays, tiers) { var u, n = Math.round(len / 1.0), hb = beam / 2, DK = 11;
      function half(t) { var bow = Math.max(0, (t - 0.7) / 0.3), st = Math.max(0, (0.07 - t) / 0.07); return hb * (1 - bow * bow) * (1 - st * st * 0.5); }
      [0.4, 2.5, 4.6, 6.7, 8.8, DK].forEach(function (hy, hi) { for (u = 0; u <= n; u++) { var t = u / n, w = half(t) * (0.84 + hi * 0.032), zz = cz - len / 2 + t * len; put(cx - w, hy, zz, 3, hi === 5 ? 1 : 0); put(cx + w, hy, zz, 3, hi === 5 ? 1 : 0); } });
      for (u = 0; u <= 1.001; u += 0.03) { var w2 = half(u), z2 = cz - len / 2 + u * len; line(cx - w2 * 0.84, 0.4, z2, cx - w2, DK, z2, 1.1, 3); line(cx + w2 * 0.84, 0.4, z2, cx + w2, DK, z2, 1.1, 3); }
      line(cx, 0.4, cz + len / 2, cx, DK + 3, cz + len / 2 + 2, 0.8, 3, 1);                                                    /* stem */
      var sz = cz - len / 2 + len * 0.1; box(cx, DK, sz, beam * 0.74, 20, len * 0.09, 1.3, 3, true); box(cx, DK + 20, sz, beam * 0.92, 4.5, len * 0.05, 1.1, 3, true); cyl(cx, DK + 24.5, sz - len * 0.035, 2.4, 8, 1.1, 3, 0); line(cx, DK + 24.5, sz + 2, cx, DK + 36, sz + 2, 0.9, 3, 1);
      var b0 = cz - len / 2 + len * 0.19, bl = len * 0.56 / bays; for (i = 0; i < bays; i++) { for (j = -1; j <= 1; j += 2) { var tn = 1 + ((i * 2 + (j > 0 ? 1 : 0)) % tiers); for (k = 0; k < tn; k++) { box(cx + j * beam * 0.22, DK + k * 6.4, b0 + i * bl + bl / 2, beam * 0.36, 6.2, bl * 0.84, 2.6, 3, false); } } } }
    ship(s.x - 176, s.z + 4, 156, 28, 6, 3);
    ship(s.x - 250, s.z - 118, 104, 22, 4, 2); })();
  /* ---- 004 Fisheries, Seaweed & Blue Economy: the same seaweed lines, net pens, jetty with landing shed and working boats, in more detail ---- */
  s = SITES[3];
  (function () { var i, j, a, y;
    /* seaweed lines: poles with float buoys, twin ropes, hanging fronds, anchor lines at both ends, and two harvest rafts */
    for (i = 0; i < 12; i++) { var lz = s.z - 118 + i * 12;
      for (j = 0; j <= 6; j++) { var lx = s.x - 150 + j * 26; line(lx, -1, lz, lx, 7.5, lz, 1.1, 4, 1); ring(lx, 7.9, lz, 1.2, 0.8, 4, 1); ring(lx, 2.2, lz, 1.5, 0.9, 4);
        if (j < 6) { line(lx, 6.2, lz, lx + 26, 6.2, lz, 1.2, 4); line(lx, 4.6, lz, lx + 26, 4.6, lz, 1.8, 4); for (a = 2; a < 26; a += 2.3) { line(lx + a, 6.2, lz, lx + a + 0.5, 1.6, lz + ((Math.round(a) % 2) ? 0.9 : -0.9), 1.1, 4); } } }
      line(s.x - 150, 6.2, lz, s.x - 162, 0, lz, 1.4, 4); line(s.x + 6, 6.2, lz, s.x + 18, 0, lz, 1.4, 4); }
    [[-176, -70], [-176, -20]].forEach(function (r) { var rx = s.x + r[0], rz = s.z + r[1];
      for (a = -8; a <= 8; a += 2) { line(rx - 12, 1.4, rz + a, rx + 12, 1.4, rz + a, 1.3, 4); } line(rx - 12, 1.4, rz - 8, rx - 12, 1.4, rz + 8, 1.2, 4, 1); line(rx + 12, 1.4, rz - 8, rx + 12, 1.4, rz + 8, 1.2, 4, 1);
      [-7, 0, 7].forEach(function (e) { line(rx + e, 1.4, rz - 6, rx + e, 5.4, rz - 6, 1.2, 4); line(rx + e, 1.4, rz + 6, rx + e, 5.4, rz + 6, 1.2, 4); line(rx + e, 5.4, rz - 6, rx + e, 5.4, rz + 6, 1.0, 4, 1); for (y = -5; y <= 5; y += 2.5) { line(rx + e, 5.4, rz + y, rx + e, 3.4, rz + y, 1.0, 4); } }); });
    /* net pens: double collar, handrail on posts, net walls down to a weighted ring, a bird net over the top, and a walkway joining each row to a feed barge */
    for (i = 0; i < 6; i++) { var cx = s.x - 118 + (i % 3) * 58, cz = s.z + 70 + Math.floor(i / 3) * 56;
      ring(cx, 3.2, cz, 21, 1.0, 4, 1); ring(cx, 3.2, cz, 23.5, 1.1, 4); ring(cx, 7, cz, 21, 1.1, 4, 1); ring(cx, 5.1, cz, 21, 1.6, 4);
      for (a = 0; a < 28; a++) { var an = a / 28 * Math.PI * 2, c1 = Math.cos(an), s1 = Math.sin(an); line(cx + c1 * 21, 3.2, cz + s1 * 21, cx + c1 * 21, 7, cz + s1 * 21, 1.2, 4); if (a % 2 === 0) { line(cx + c1 * 21, 3.2, cz + s1 * 21, cx + c1 * 15, -2.4, cz + s1 * 15, 1.5, 4); line(cx + c1 * 21, 3.2, cz + s1 * 21, cx + c1 * 23.5, 3.2, cz + s1 * 23.5, 1.0, 4); } if (a % 4 === 0) { line(cx + c1 * 21, 7, cz + s1 * 21, cx, 11.5, cz, 1.6, 4); } }
      ring(cx, 0.4, cz, 17.5, 1.6, 4); ring(cx, -2.4, cz, 15, 1.5, 4); ring(cx, 9.2, cz, 10.5, 1.5, 4); line(cx, 7, cz, cx, 12.5, cz, 0.9, 4, 1); }
    [70, 126].forEach(function (rowZ) { line(s.x - 141.5, 3.4, s.z + rowZ - 24, s.x + 21.5, 3.4, s.z + rowZ - 24, 1.2, 4); line(s.x - 141.5, 3.4, s.z + rowZ - 26.4, s.x + 21.5, 3.4, s.z + rowZ - 26.4, 1.2, 4); for (a = -140; a <= 20; a += 6) { line(s.x + a, 3.4, s.z + rowZ - 24, s.x + a, 3.4, s.z + rowZ - 26.4, 1.2, 4); } });
    var fbx = s.x + 34, fbz = s.z + 98;                                                                                     /* feed barge with silo and hopper */
    frameBox(fbx, 1.2, fbz, 18, 3, 12, 1.0, 4); for (a = -9; a <= 9; a += 3) { line(fbx + a, 4.2, fbz - 6, fbx + a, 4.2, fbz + 6, 1.4, 4); } cyl(fbx - 3, 4.2, fbz, 3.4, 9, 1.1, 4, 2.5); frameBox(fbx + 5, 4.2, fbz, 5, 4.5, 6, 1.0, 4); line(fbx - 9, 3.4, fbz - 3, s.x + 21.5, 3.4, s.z + 46, 1.2, 4, 1);
    /* jetty: plank deck on cross-braced piles, handrails, bollards, a ladder, a hoist, crates, and a gabled landing shed with door and windows */
    var jz0 = s.z + 40, jz1 = s.z + 48, jx0 = s.x + 40, jx1 = s.x + 150;
    line(jx1, 6, jz0, jx0, 6, jz0, 1.0, 4, 1); line(jx1, 6, jz1, jx0, 6, jz1, 1.0, 4, 1); line(jx0, 6, jz0, jx0, 6, jz1, 1.0, 4, 1);
    for (a = 40; a <= 150; a += 2) { line(s.x + a, 6, jz0, s.x + a, 6, jz1, 1.9, 4); }
    for (a = 40; a <= 150; a += 11) { line(s.x + a, -2, jz0, s.x + a, 6, jz0, 1.2, 4); line(s.x + a, -2, jz1, s.x + a, 6, jz1, 1.2, 4); line(s.x + a, 0, jz0, s.x + a, 4.6, jz1, 1.3, 4); line(s.x + a, 6, jz0, s.x + a, 9, jz0, 1.0, 4); line(s.x + a, 6, jz1, s.x + a, 9, jz1, 1.0, 4); }
    line(jx0 + 30, 9, jz0, jx1, 9, jz0, 1.2, 4); line(jx0 + 30, 9, jz1, jx1, 9, jz1, 1.2, 4); line(jx0 + 30, 7.5, jz0, jx1, 7.5, jz0, 1.8, 4); line(jx0 + 30, 7.5, jz1, jx1, 7.5, jz1, 1.8, 4);
    [44, 52, 60].forEach(function (b) { line(s.x + b, 6, jz0 - 0.6, s.x + b, 7.6, jz0 - 0.6, 0.6, 4, 1); });                                               /* bollards */
    line(jx0 - 0.5, 6, jz0 + 2, jx0 - 0.5, -1, jz0 + 2, 0.9, 4); line(jx0 - 0.5, 6, jz0 + 4, jx0 - 0.5, -1, jz0 + 4, 0.9, 4); for (y = 0; y <= 5; y += 1.4) { line(jx0 - 0.5, y, jz0 + 2, jx0 - 0.5, y, jz0 + 4, 0.8, 4); }   /* ladder */
    line(jx0 + 3, 6, jz0, jx0 + 3, 15, jz0, 0.9, 4); line(jx0 + 3, 15, jz0, jx0 + 3, 13.5, jz0 - 7, 0.9, 4, 1); line(jx0 + 3, 13.5, jz0 - 7, jx0 + 3, 8, jz0 - 7, 1.0, 4);                                        /* hoist */
    [[8, 44, 0], [8, 44, 2.2], [11.5, 44, 0], [9.5, 46.5, 0]].forEach(function (c) { frameBox(jx0 + c[0], 6 + c[2], s.z + c[1] - 1.5, 2.8, 2.2, 2.4, 0.9, 4); });                                                /* fish crates */
    var shx = s.x + 86, shz = s.z + 44; box(shx, 6, shz, 30, 9, 16, 1.5, 4, false);
    for (a = -15; a <= 15; a += 3) { line(shx + a, 15, shz - 8, shx + a, 19.5, shz, 1.2, 4, Math.abs(a) > 14 ? 1 : 0); line(shx + a, 19.5, shz, shx + a, 15, shz + 8, 1.2, 4); } line(shx - 15, 19.5, shz, shx + 15, 19.5, shz, 0.9, 4, 1);
    frameBox(shx - 6, 6, shz - 8.2, 6, 6.5, 0.4, 0.9, 4); [4, 10].forEach(function (wx) { frameBox(shx + wx, 9.5, shz - 8.2, 3, 2.6, 0.4, 0.9, 4); });
    /* boats: full hull with ribs and keel line, deck, bow rail, wheelhouse with windows and roof, mast with crosstree and lights, twin outrigger booms, net drum and nets */
    [[-40, 30, 0.2, 1.2], [70, -40, 1.3, 1.0], [-170, -150, 2.0, 1.1], [20, 150, 2.8, 0.9]].forEach(function (b) { var bx = s.x + b[0], bz = s.z + b[1], ca = Math.cos(b[2]), sa = Math.sin(b[2]), k = b[3];
      function P(u, v, yy, fl) { put(bx + u * ca - v * sa, yy, bz + u * sa + v * ca, 4, fl || 0); }
      function L(u1, v1, y1, u2, v2, y2, st, fl) { line(bx + u1 * ca - v1 * sa, y1, bz + u1 * sa + v1 * ca, bx + u2 * ca - v2 * sa, y2, bz + u2 * sa + v2 * ca, st, 4, fl || 0); }
      function hw(t) { return 5.4 * k * (1 - 0.4 * Math.max(0, Math.cos(t))); }
      [0.4, 1.7, 3.0, 4.3, 5.6].forEach(function (hy, hi) { var sc = 0.74 + hi * 0.065; for (var q = 0; q < 70; q++) { var t = q / 70 * Math.PI * 2; P(Math.cos(t) * 19 * k * sc, Math.sin(t) * hw(t) * sc, hy, hi === 4 ? 1 : 0); } });
      for (var q2 = 0; q2 < 18; q2++) { var t2 = q2 / 18 * Math.PI * 2; L(Math.cos(t2) * 19 * k * 0.74, Math.sin(t2) * hw(t2) * 0.74, 0.4, Math.cos(t2) * 19 * k, Math.sin(t2) * hw(t2), 5.6, 1.3); }
      for (a = -15; a <= 13; a += 2.6) { var hwa = 5.4 * k * 0.9 * Math.sqrt(Math.max(0, 1 - Math.pow(a / 19, 2))); L(a * k, -hwa, 5.6, a * k, hwa, 5.6, 1.5); }                 /* deck planks */
      L(19 * k, 0, 5.6, 21.5 * k, 0, 8.2, 0.8, 1); L(12 * k, -3.2 * k, 7.6, 19 * k, 0, 8, 0.9); L(12 * k, 3.2 * k, 7.6, 19 * k, 0, 8, 0.9); L(12 * k, -3.2 * k, 5.6, 12 * k, -3.2 * k, 7.6, 0.9); L(12 * k, 3.2 * k, 5.6, 12 * k, 3.2 * k, 7.6, 0.9);   /* stem and bow rail */
      var wu = -6 * k, wl = 4.2 * k, ww = 3.1 * k;                                                                              /* wheelhouse */
      [5.6, 9, 11.8].forEach(function (yy, li) { L(wu - wl, -ww, yy, wu + wl, -ww, yy, 0.9, li === 2 ? 1 : 0); L(wu - wl, ww, yy, wu + wl, ww, yy, 0.9, li === 2 ? 1 : 0); L(wu - wl, -ww, yy, wu - wl, ww, yy, 0.9, li === 2 ? 1 : 0); L(wu + wl, -ww, yy, wu + wl, ww, yy, 0.9, li === 2 ? 1 : 0); });
      [[-wl, -ww], [wl, -ww], [-wl, ww], [wl, ww], [0, -ww], [0, ww], [wl, 0]].forEach(function (c) { L(wu + c[0], c[1], 5.6, wu + c[0], c[1], 11.8, 0.9); });
      L(wu - wl - 0.6, -ww - 0.5, 12.2, wu + wl + 1.2, -ww - 0.5, 12.2, 1.0); L(wu - wl - 0.6, ww + 0.5, 12.2, wu + wl + 1.2, ww + 0.5, 12.2, 1.0); L(wu + wl + 1.2, -ww - 0.5, 12.2, wu + wl + 1.2, ww + 0.5, 12.2, 1.0);
      var mu = 3 * k; L(mu, 0, 5.6, mu, 0, 24, 0.9, 1); L(mu, -4 * k, 18.5, mu, 4 * k, 18.5, 0.9); P(mu, 0, 24.6, 1); P(mu, 0, 25.1, 1);                                           /* mast, crosstree, light */
      L(mu, 0, 17, 15 * k, 0, 9.5, 1.0); L(mu, 0, 22, wu, 0, 12.2, 1.4); L(mu, 0, 22, 18 * k, 0, 8, 1.6);                                                                 /* boom and stays */
      [-1, 1].forEach(function (sd) { L(mu, 0, 14, mu - 2 * k, sd * 13 * k, 10.5, 1.0); L(mu - 2 * k, sd * 13 * k, 10.5, mu - 2 * k, sd * 13 * k, 2, 1.4); L(mu, 0, 20, mu - 2 * k, sd * 13 * k, 10.5, 1.5); });   /* outriggers with lines down to the water */
      for (var q3 = 0; q3 < 12; q3++) { var t3 = q3 / 12 * Math.PI * 2; P(-14 * k, Math.cos(t3) * 2.6 * k, 7.6 + Math.sin(t3) * 1.7, q3 % 3 === 0 ? 1 : 0); P(-14 * k, Math.cos(t3) * 1.4 * k, 7.6 + Math.sin(t3) * 0.9); }   /* net drum */
      L(-14 * k, -2.8 * k, 5.6, -14 * k, -2.8 * k, 7.6, 0.9); L(-14 * k, 2.8 * k, 5.6, -14 * k, 2.8 * k, 7.6, 0.9); L(-16 * k, -2.5 * k, 7.6, -24 * k, -5 * k, 0.4, 1.3); L(-16 * k, 2.5 * k, 7.6, -24 * k, 5 * k, 0.4, 1.3); L(-24 * k, -5 * k, 0.4, -24 * k, 5 * k, 0.4, 1.2); }); })();

  /* ---- 005 Health & Bioscience: the same growing tunnels, greenhouse, lab and tanks, in more detail, with plants visible inside ---- */
  s = SITES[4];
  function tuft(x, y, z, h, site) { line(x, y, z, x, y + h, z, 0.8, site); put(x - h * 0.35, y + h * 0.8, z, site, 0); put(x + h * 0.35, y + h * 0.8, z, site, 0); put(x, y + h * 0.7, z - h * 0.35, site, 0); put(x, y + h * 0.7, z + h * 0.35, site, 0); }
  for (var t5 = 0; t5 < 5; t5++) { var tcx = s.x - 84 + t5 * 22, tz0 = s.z - 57, tz1 = s.z + 69; tunnel(tcx, PAD_Y, s.z + 6, 126, 9.5, 1.9, 5);
    line(tcx - 9.5, PAD_Y + 0.3, tz0, tcx - 9.5, PAD_Y + 0.3, tz1, 1.1, 5); line(tcx + 9.5, PAD_Y + 0.3, tz0, tcx + 9.5, PAD_Y + 0.3, tz1, 1.1, 5);                      /* base rails */
    line(tcx - 6.7, PAD_Y + 6.7, tz0, tcx - 6.7, PAD_Y + 6.7, tz1, 1.6, 5); line(tcx + 6.7, PAD_Y + 6.7, tz0, tcx + 6.7, PAD_Y + 6.7, tz1, 1.6, 5);                      /* side purlins */
    [tz0, tz1].forEach(function (ez) { line(tcx - 2.4, PAD_Y, ez, tcx - 2.4, PAD_Y + 6, ez, 0.8, 5, 1); line(tcx + 2.4, PAD_Y, ez, tcx + 2.4, PAD_Y + 6, ez, 0.8, 5, 1); line(tcx - 2.4, PAD_Y + 6, ez, tcx + 2.4, PAD_Y + 6, ez, 0.8, 5, 1); line(tcx - 9.5, PAD_Y, ez, tcx + 9.5, PAD_Y, ez, 1.1, 5); line(tcx, PAD_Y + 6, ez, tcx, PAD_Y + 9.5, ez, 1.0, 5); });   /* end frames and doors */
    for (var tv = -48; tv <= 60; tv += 18) { frameBox(tcx, PAD_Y + 9.5, s.z + tv, 3.4, 1.2, 5, 0.9, 5); }                                                              /* ridge vents */
    for (var tp = tz0 + 5; tp <= tz1 - 4; tp += 6.3) { tuft(tcx - 4.2, PAD_Y, tp, 2.4 + (Math.round(tp) % 3) * 0.5, 5); tuft(tcx + 4.2, PAD_Y, tp + 2.1, 2.4 + (Math.round(tp + 1) % 3) * 0.5, 5); } }
  (function () { var P0 = PAD_Y, i, a, gx0 = s.x + 22, gx1 = s.x + 78, gz0 = s.z - 44, gz1 = s.z + 56, wh = 10, rh = 6;
    [P0, P0 + wh].forEach(function (yy) { line(gx0, yy, gz0, gx1, yy, gz0, 1.1, 5); line(gx0, yy, gz1, gx1, yy, gz1, 1.1, 5); line(gx0, yy, gz0, gx0, yy, gz1, 1.1, 5); line(gx1, yy, gz0, gx1, yy, gz1, 1.1, 5); });
    for (a = gx0; a <= gx1 + 0.01; a += 7) { line(a, P0, gz0, a, P0 + wh, gz0, 1.5, 5); line(a, P0, gz1, a, P0 + wh, gz1, 1.5, 5); }
    for (a = gz0; a <= gz1 + 0.01; a += 10) { line(gx0, P0, a, gx0, P0 + wh, a, 1.5, 5); line(gx1, P0, a, gx1, P0 + wh, a, 1.5, 5); }
    for (i = 0; i < 4; i++) { var rx0 = gx0 + i * 14, rxm = rx0 + 7, rx1 = rx0 + 14;
      [gz0, gz1].forEach(function (zz) { line(rx0, P0 + wh, zz, rxm, P0 + wh + rh, zz, 1.1, 5); line(rxm, P0 + wh + rh, zz, rx1, P0 + wh, zz, 1.1, 5); });
      line(rxm, P0 + wh + rh, gz0, rxm, P0 + wh + rh, gz1, 1.1, 5, 1); if (i > 0) { line(rx0, P0 + wh, gz0, rx0, P0 + wh, gz1, 1.8, 5); } }
    for (i = 0; i < 4; i++) { var bx = gx0 + 5.5 + i * 14; line(bx, P0 + 2.6, gz0 + 6, bx, P0 + 2.6, gz1 - 6, 1.5, 5); line(bx + 3, P0 + 2.6, gz0 + 6, bx + 3, P0 + 2.6, gz1 - 6, 1.5, 5);
      for (a = gz0 + 8; a <= gz1 - 7; a += 3.6) { tuft(bx + 1.5, P0 + 2.6, a, 2.2 + ((Math.round(a) + i) % 3) * 0.6, 5); if (Math.round(a) % 2 === 0) { line(bx, P0, a, bx, P0 + 2.6, a, 1.4, 5); line(bx + 3, P0, a, bx + 3, P0 + 2.6, a, 1.4, 5); } }
      line(bx + 1.5, P0 + wh - 1, gz0 + 4, bx + 1.5, P0 + wh - 1, gz1 - 4, 1.3, 5, 1);                                                                             /* irrigation line */
      for (a = gz0 + 12; a <= gz1 - 12; a += 22) { var vx = gx0 + i * 14 + 7; line(vx, P0 + wh + rh, a - 4, vx + 4.5, P0 + wh + rh + 1.6, a - 4, 0.9, 5); line(vx, P0 + wh + rh, a + 4, vx + 4.5, P0 + wh + rh + 1.6, a + 4, 0.9, 5); line(vx + 4.5, P0 + wh + rh + 1.6, a - 4, vx + 4.5, P0 + wh + rh + 1.6, a + 4, 0.9, 5, 1); } }   /* open roof vents */
    line(gx0, P0 + wh / 2, gz0, gx1, P0 + wh / 2, gz0, 1.4, 5); line(gx0, P0 + wh / 2, gz1, gx1, P0 + wh / 2, gz1, 1.4, 5); line(gx0, P0 + wh / 2, gz0, gx0, P0 + wh / 2, gz1, 1.4, 5); line(gx1, P0 + wh / 2, gz0, gx1, P0 + wh / 2, gz1, 1.4, 5);   /* glazing bar */
    frameBox((gx0 + gx1) / 2, P0, gz0 - 0.3, 6, 7.5, 0.4, 0.9, 5); line((gx0 + gx1) / 2, P0, gz0 - 0.3, (gx0 + gx1) / 2, P0 + 7.5, gz0 - 0.3, 0.9, 5, 1); })();
  box(s.x + 112, PAD_Y, s.z - 20, 44, 22, 62, 1.9, 5, true);
  (function () { var P0 = PAD_Y, lx0 = s.x + 90, lx1 = s.x + 134, lz0 = s.z - 51, lz1 = s.z + 11, a, q;
    [P0 + 7, P0 + 17].forEach(function (wy) { line(lx0 - 0.3, wy, lz0 + 3, lx0 - 0.3, wy, lz1 - 3, 0.8, 5, 1); line(lx0 + 3, wy, lz0 - 0.3, lx1 - 3, wy, lz0 - 0.3, 0.8, 5, 1); });                  /* window bands on two floors */
    line(lx0 - 0.3, P0 + 11, lz0, lx0 - 0.3, P0 + 11, lz1, 1.0, 5); line(lx0, P0 + 11, lz0 - 0.3, lx1, P0 + 11, lz0 - 0.3, 1.0, 5);
    for (a = lz0 + 5; a < lz1; a += 5.2) { line(lx0 - 0.4, P0, a, lx0 - 0.4, P0 + 22, a, 1.5, 5); } for (a = lx0 + 5; a < lx1; a += 5.5) { line(a, P0, lz0 - 0.4, a, P0 + 22, lz0 - 0.4, 1.5, 5); }                 /* facade fins */
    frameBox(lx0 - 3, P0, s.z - 20, 6, 7, 10, 0.9, 5); line(lx0 - 6, P0 + 7, s.z - 25, lx0 - 6, P0 + 7, s.z - 15, 0.8, 5, 1);                                              /* entrance */
    [[-10, -18], [4, -18], [-10, 0], [4, 0]].forEach(function (c) { frameBox(s.x + 112 + c[0], P0 + 22, s.z - 20 + c[1], 9, 3.4, 9, 1.0, 5); ring(s.x + 112 + c[0], P0 + 25.6, s.z - 20 + c[1], 2.4, 0.8, 5, 1); });   /* roof plant with fans */
    [-24, -17, -10].forEach(function (ez) { cyl(lx1 - 6, P0 + 22, s.z - 20 + ez, 1.3, 9, 1.0, 5, 0); ring(lx1 - 6, P0 + 31, s.z - 20 + ez, 2, 0.8, 5, 1); });                            /* fume exhausts */
    frameBox(s.x + 112, P0 + 22, s.z + 2, 20, 2.2, 10, 1.1, 5);                                                                                                  /* skylight */
    for (q = 0; q < 4; q++) { var tx = s.x + 104 + (q % 2) * 18, tz = s.z + 34 + Math.floor(q / 2) * 18;                                                           /* tanks: level bands, rim rail, ladder, base ring */
      cyl(tx, P0, tz, 6.5, 20, 1.6, 5, 3); ring(tx, P0 + 7, tz, 6.7, 0.8, 5, 1); ring(tx, P0 + 14, tz, 6.7, 0.8, 5, 1); ring(tx, P0 + 21.2, tz, 7.1, 0.9, 5); ring(tx, P0 + 0.4, tz, 8, 1.1, 5);
      line(tx - 6.8, P0, tz - 0.8, tx - 6.8, P0 + 21, tz - 0.8, 0.9, 5); line(tx - 6.8, P0, tz + 0.8, tx - 6.8, P0 + 21, tz + 0.8, 0.9, 5); for (a = 1.5; a < 21; a += 1.8) { line(tx - 6.8, P0 + a, tz - 0.8, tx - 6.8, P0 + a, tz + 0.8, 0.8, 5); }
      line(tx, P0 + 23, tz, tx, P0 + 26, tz, 0.8, 5, 1); }
    line(s.x + 104, P0 + 10, s.z + 34, s.x + 122, P0 + 10, s.z + 34, 0.9, 5); line(s.x + 104, P0 + 10, s.z + 52, s.x + 122, P0 + 10, s.z + 52, 0.9, 5); line(s.x + 113, P0 + 10, s.z + 52, s.x + 113, P0 + 10, s.z + 11, 0.9, 5, 1); line(s.x + 113, P0 + 10, s.z + 11, s.x + 113, P0 + 4, s.z + 11, 0.9, 5); })();

  /* ---- 006 Agriculture & Green Economy: the terraces are the terrain itself; the site adds only the terrace edges and two sheds ---- */
  s = SITES[5];
  (function () { var stp = 2.0 * OS, gx, gz, nx = Math.ceil(278 / stp), nz = Math.ceil(228 / stp);
    for (gz = -nz; gz <= nz; gz++) { for (gx = -nx; gx <= nx; gx++) { var x = s.x + gx * stp, z = s.z - 70 + gz * stp, wa = wAgri(x, z); if (wa < 0.3) { continue; }
      var hs = groundS(x, z); if (hs < 0) { continue; } var L = Math.floor(hs / TSTEP);
      var Lx = Math.floor(groundS(x + stp, z) / TSTEP), Lz = Math.floor(groundS(x, z + stp) / TSTEP);
      if (Lx !== L || Lz !== L) { if (wa < 0.9 && hash(gx * 1.31 + 3, gz * 2.17) > wa) { continue; } var lo = Math.min(L, Lx, Lz) * TSTEP + 2, hi = Math.max(L, Lx, Lz) * TSTEP + 2; put(x, lo + (hi - lo) * 0.5, z, 6, 0); put(x, hi + 0.8, z, 6, 1); } } }
    [[-30, -38], [140, -102], [96, -200], [-30, -182]].forEach(function (c) { box(s.x + c[0], ground(s.x + c[0], s.z + c[1]), s.z + c[1], 18, 8, 12, 1.9, 6, true); });
    function gp(x, z, lift, fl) { var gy = ground(x, z); if (gy >= 0 && x - coast(z) > 60) { put(x, gy + lift, z, 6, fl); } }
    [[20, -70, 54, 30, 0], [92, -82, 44, 28, 1], [-12, -126, 46, 30, 1], [56, -140, 56, 30, 0], [128, -150, 42, 28, 1], [24, -196, 50, 28, 0]].forEach(function (f) {
      var cx = s.x + f[0], cz = s.z + f[1], w = f[2], d = f[3], a, b;
      for (a = -w / 2; a <= w / 2; a += 1.8 * OS) { gp(cx + a, cz - d / 2, 1.0, 1); gp(cx + a, cz + d / 2, 1.0, 1); }
      for (b = -d / 2; b <= d / 2; b += 1.8 * OS) { gp(cx - w / 2, cz + b, 1.0, 1); gp(cx + w / 2, cz + b, 1.0, 1); }
      if (f[4]) { for (a = -w / 2 + 4; a < w / 2 - 2; a += 4.6) { for (b = -d / 2 + 2.5; b < d / 2 - 2; b += 1.9 * OS) { gp(cx + a, cz + b, 1.4, 0); } } }
      else { for (b = -d / 2 + 4; b < d / 2 - 2; b += 4.6) { for (a = -w / 2 + 2.5; a < w / 2 - 2; a += 1.9 * OS) { gp(cx + a, cz + b, 1.4, 0); } } } }); })();

  /* ---- 007 Food & Beverage: grain silos with an elevator and catwalk, a sawtooth process hall, a dispatch warehouse with trucks, tanks and a stack ---- */
  s = SITES[6];
  (function () { var q, i;
    for (i = 0; i < 6; i++) { var sx = s.x - 30 + (i % 3) * 24, sz = s.z + 44 + Math.floor(i / 3) * 24; cyl(sx, PAD_Y, sz, 10.5, 58, 2.2, 7, 8); }             /* six silos */
    [44, 68].forEach(function (rz) { line(s.x - 34, PAD_Y + 68, s.z + rz, s.x + 22, PAD_Y + 68, s.z + rz, 1.5, 7, 1); line(s.x - 34, PAD_Y + 71, s.z + rz, s.x + 22, PAD_Y + 71, s.z + rz, 1.8, 7); });
    frameBox(s.x + 46, PAD_Y, s.z + 56, 8, 86, 8, 1.6, 7);                                                                                                  /* bucket elevator */
    for (q = 0; q < 86; q += 9) { line(s.x + 42, PAD_Y + q, s.z + 52, s.x + 50, PAD_Y + q + 9, s.z + 52, 1.8, 7); }
    line(s.x + 46, PAD_Y + 86, s.z + 56, s.x + 22, PAD_Y + 70, s.z + 56, 1.4, 7, 1); line(s.x + 46, PAD_Y + 80, s.z + 52, s.x + 28, PAD_Y + 31, s.z + 14, 1.4, 7, 1); line(s.x + 49, PAD_Y + 80, s.z + 52, s.x + 31, PAD_Y + 31, s.z + 14, 1.4, 7, 1);
    box(s.x + 20, PAD_Y, s.z, 96, 20, 40, 2.4, 7, false);                                                                                                   /* process hall with a sawtooth roof */
    for (q = 0; q < 6; q++) { var rx = s.x - 28 + q * 16; [s.z - 20, s.z + 20].forEach(function (ez) { line(rx, PAD_Y + 20, ez, rx + 11, PAD_Y + 31, ez, 1.7, 7, 1); line(rx + 11, PAD_Y + 31, ez, rx + 16, PAD_Y + 20, ez, 1.7, 7); }); line(rx + 11, PAD_Y + 31, s.z - 20, rx + 11, PAD_Y + 31, s.z + 20, 2.0, 7, 1); line(rx, PAD_Y + 20, s.z - 20, rx, PAD_Y + 20, s.z + 20, 2.6, 7); }
    box(s.x - 34, PAD_Y, s.z - 44, 70, 13, 30, 2.4, 7, true);                                                                                               /* dispatch warehouse, dock canopy, three trucks */
    line(s.x - 69, PAD_Y + 9, s.z - 66, s.x + 1, PAD_Y + 9, s.z - 66, 1.6, 7, 1); for (q = -69; q <= 1; q += 14) { line(s.x + q, PAD_Y + 9, s.z - 59, s.x + q, PAD_Y + 9, s.z - 66, 1.8, 7); line(s.x + q, PAD_Y, s.z - 66, s.x + q, PAD_Y + 9, s.z - 66, 1.8, 7); }
    [-60, -44, -28, -12].forEach(function (ox7) { var tx = s.x + ox7, z0 = s.z - 60, hw = 3.1, P0 = PAD_Y, y, a;      /* delivery vans, backed up to the dock */
      function wheel(x, yy, z, r) { for (var w = 0; w < 12; w++) { var an = w / 12 * Math.PI * 2; put(x, yy + Math.sin(an) * r, z + Math.cos(an) * r, 7, 0); } put(x, yy, z, 7, 0); }
      var pr = [[-1, 1.8], [-1, 9.8], [-11.6, 9.8], [-14.8, 6.3], [-17.4, 5.5], [-17.4, 1.8]];
      [-hw, hw].forEach(function (ox) {                                                             /* side profile: load box, windscreen, bonnet */
        for (var q = 0; q < pr.length; q++) { var p1 = pr[q], p2 = pr[(q + 1) % pr.length]; line(tx + ox, P0 + p1[1], z0 + p1[0], tx + ox, P0 + p2[1], z0 + p2[0], 0.75, 7, q === 1 || q === 2 ? 1 : 0); }
        for (y = P0 + 2.9; y < P0 + 9.5; y += 1.1) { line(tx + ox, y, z0 - 1, tx + ox, y, z0 - 11.2, 1.0, 7); }                    /* panelled load box */
        line(tx + ox, P0 + 1.8, z0 - 6.4, tx + ox, P0 + 9.8, z0 - 6.4, 0.8, 7);                                               /* sliding door */
        line(tx + ox, P0 + 1.8, z0 - 11.6, tx + ox, P0 + 9.8, z0 - 11.6, 0.8, 7);                                             /* cab door */
        line(tx + ox, P0 + 6.4, z0 - 11.9, tx + ox, P0 + 9.0, z0 - 11.9, 0.8, 7, 1); line(tx + ox, P0 + 6.4, z0 - 11.9, tx + ox, P0 + 6.4, z0 - 14.4, 0.8, 7, 1); line(tx + ox, P0 + 9.0, z0 - 11.9, tx + ox, P0 + 6.4, z0 - 14.4, 0.8, 7, 1); });   /* side window */
      [-hw - 0.3, hw + 0.3].forEach(function (ox) { wheel(tx + ox, P0 + 1.7, z0 - 4.2, 1.7); wheel(tx + ox, P0 + 1.7, z0 - 14.2, 1.7); });
      for (a = 1; a <= 11.6; a += 1.5) { line(tx - hw, P0 + 9.8, z0 - a, tx + hw, P0 + 9.8, z0 - a, 1.0, 7, a === 1 ? 1 : 0); }                 /* roof */
      [[-11.6, 9.8], [-14.8, 6.3], [-17.4, 5.5], [-17.4, 1.8], [-17.4, 3.6]].forEach(function (p1) { line(tx - hw, P0 + p1[1], z0 + p1[0], tx + hw, P0 + p1[1], z0 + p1[0], 0.85, 7, p1[1] > 9 ? 1 : 0); });
      line(tx, P0 + 9.8, z0 - 11.6, tx, P0 + 6.3, z0 - 14.8, 1.0, 7);                                                          /* windscreen centre */
      for (y = P0 + 1.8; y <= P0 + 9.81; y += 1.3) { line(tx - hw, y, z0 - 1, tx + hw, y, z0 - 1, 1.0, 7); } line(tx, P0 + 1.8, z0 - 1, tx, P0 + 9.8, z0 - 1, 0.8, 7);   /* rear doors */
      put(tx - hw + 0.7, P0 + 4.4, z0 - 17.5, 7, 1); put(tx + hw - 0.7, P0 + 4.4, z0 - 17.5, 7, 1); });                          /* headlights */
    [[74, 40], [88, 40], [81, 54]].forEach(function (c) { cyl(s.x + c[0], PAD_Y, s.z + c[1], 5.6, 24, 1.9, 7, 3); });                                        /* tanks and pipe rack */
    line(s.x + 68, PAD_Y + 12, s.z + 30, s.x + 68, PAD_Y + 12, s.z + 4, 1.5, 7); line(s.x + 71, PAD_Y + 12, s.z + 30, s.x + 71, PAD_Y + 12, s.z + 4, 1.5, 7);
    cyl(s.x + 88, PAD_Y, s.z - 8, 3.3, 98, 1.9, 7, 0); ring(s.x + 88, PAD_Y + 98, s.z - 8, 4.4, 1.2, 7, 1); })();

  /* ---- the city at the end of the flight: towers with floors, mullions and roof detail on a street grid with a park, a plaza and an elevated rail line;
          an industrial quarter on the south side with factories, tank farms, sheds, pipe racks and a crane. Context only ---- */
  FLAG = 6;
  (function () { var CX = CITY[0], CZ = CITY[1], cell = 50, gap = 22, st = 1.7 * OS, q, a, y;
    function floors(cx, y0, cz, w, d, h, mul) { var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, top = y0 + h;
      for (y = y0 + 4.2; y <= top + 0.01; y += 4.2 * OS) { line(x0, y, z0, x1, y, z0, st, 0); line(x0, y, z1, x1, y, z1, st, 0); line(x0, y, z0, x0, y, z1, st, 0); line(x1, y, z0, x1, y, z1, st, 0); }
      [[x0, z0], [x1, z0], [x0, z1], [x1, z1]].forEach(function (c) { line(c[0], y0, c[1], c[0], top, c[1], 1.0, 0); });
      line(x0, top, z0, x1, top, z0, 1.0, 0); line(x0, top, z1, x1, top, z1, 1.0, 0); line(x0, top, z0, x0, top, z1, 1.0, 0); line(x1, top, z0, x1, top, z1, 1.0, 0);
      if (mul) { for (a = x0 + mul; a < x1 - 1; a += mul) { line(a, y0, z0, a, top, z0, 2.2, 0); line(a, y0, z1, a, top, z1, 2.2, 0); } for (a = z0 + mul; a < z1 - 1; a += mul) { line(x0, y0, a, x0, top, a, 2.2, 0); line(x1, y0, a, x1, top, a, 2.2, 0); } } }
    function roofKit(cx, top, cz, w, d, kind) {                                                         /* plant boxes, a water tank, a mast or a helipad */
      frameBox(cx - w * 0.2, top, cz - d * 0.15, w * 0.28, 3, d * 0.3, 1.2, 0); if (kind > 0.3) { frameBox(cx + w * 0.22, top, cz + d * 0.2, w * 0.22, 2.4, d * 0.22, 1.2, 0); }
      if (kind > 0.75) { ring(cx, top + 0.4, cz, Math.min(w, d) * 0.3, 1.1, 0); line(cx - 2.5, top + 0.4, cz - 3, cx - 2.5, top + 0.4, cz + 3, 1, 0); line(cx + 2.5, top + 0.4, cz - 3, cx + 2.5, top + 0.4, cz + 3, 1, 0); line(cx - 2.5, top + 0.4, cz, cx + 2.5, top + 0.4, cz, 1, 0); }
      else if (kind > 0.45) { line(cx + w * 0.3, top, cz - d * 0.3, cx + w * 0.3, top + 14, cz - d * 0.3, 1.1, 0); }
      else { cyl(cx + w * 0.25, top, cz - d * 0.25, 2.2, 4, 1.3, 0, 1.5); } }
    /* streets: kerb lines round every block and a dashed centre line down every street */
    for (var sz2 = 430 - gap / 2; sz2 <= 720; sz2 += cell + gap) { for (a = 640; a <= 920; a += 5.5) { put(a, PAD_Y + 0.2, sz2, 0, 0); put(a + 1.6, PAD_Y + 0.2, sz2, 0, 0); } }
    for (var sx2 = 650 - gap / 2; sx2 <= 920; sx2 += cell + gap) { for (a = 420; a <= 720; a += 5.5) { put(sx2, PAD_Y + 0.2, a, 0, 0); put(sx2, PAD_Y + 0.2, a + 1.6, 0, 0); } }
    for (var bz = 430; bz + cell <= 710; bz += cell + gap) { for (var bx = 650; bx + cell <= 910; bx += cell + gap) {
      var mx = bx + cell / 2, mz = bz + cell / 2, gy = PAD_Y, dC = Math.sqrt((mx - CX) * (mx - CX) + (mz - CZ) * (mz - CZ)), r1 = hash(bx * 0.13, bz * 0.29), r2 = hash(bx * 0.41, bz * 0.17), r3 = hash(bx * 0.77, bz * 0.53);
      frameBox(mx, gy, mz, cell, 0.6, cell, 2.6, 0);                                                    /* kerb */
      if (bz < 500) {                                    /* industrial quarter */
        if (r2 < 0.34) { box(mx - 4, gy, mz, 42, 16, 38, 1.9, 0, false);                                /* sawtooth factory: roof teeth, doors, stack with rings, yard pipe rack */
          for (q = 0; q < 3; q++) { var rx = mx - 25 + q * 14; [mz - 19, mz + 19].forEach(function (ez) { line(rx, gy + 16, ez, rx + 9, gy + 25, ez, 1.4, 0); line(rx + 9, gy + 25, ez, rx + 14, gy + 16, ez, 1.4, 0); }); line(rx + 9, gy + 25, mz - 19, rx + 9, gy + 25, mz + 19, 1.6, 0); line(rx, gy + 16, mz - 19, rx, gy + 16, mz + 19, 2.4, 0); for (a = -15; a <= 15; a += 7.5) { line(rx, gy + 16, mz + a, rx + 9, gy + 25, mz + a, 2.4, 0); } }
          for (q = 0; q < 3; q++) { frameBox(mx - 18 + q * 12, gy, mz - 19.3, 6, 7, 0.4, 1.1, 0); }
          cyl(mx + 21, gy, mz + 12, 3.2, 62, 1.7, 0, 0); ring(mx + 21, gy + 62, mz + 12, 4.2, 1.0, 0); ring(mx + 21, gy + 40, mz + 12, 3.9, 1.1, 0);
          line(mx + 18, gy + 7, mz - 19, mx + 18, gy + 7, mz + 6, 1.4, 0); line(mx + 20.5, gy + 7, mz - 19, mx + 20.5, gy + 7, mz + 6, 1.4, 0); for (a = -19; a <= 6; a += 8) { line(mx + 19.2, gy, mz + a, mx + 19.2, gy + 7, mz + a, 1.5, 0); } }
        else if (r2 < 0.66) { for (q = 0; q < 4; q++) { var tx2 = mx - 12 + (q % 2) * 24, tz2 = mz - 11 + Math.floor(q / 2) * 22, th2 = 20 + (q % 2) * 7; cyl(tx2, gy, tz2, 9, th2, 1.7, 0, 4); ring(tx2, gy + th2, tz2, 9.8, 1.0, 0); for (a = 0; a < 20; a++) { var sa = a / 20 * Math.PI * 1.6; put(tx2 + Math.cos(sa) * 9.9, gy + a / 20 * th2, tz2 + Math.sin(sa) * 9.9, 0, 0); } }   /* tank farm: rim rails and spiral stairs */
          line(mx - 22, gy + 9, mz, mx + 22, gy + 9, mz, 1.3, 0); line(mx - 22, gy + 11, mz, mx + 22, gy + 11, mz, 1.3, 0); line(mx, gy + 9, mz - 22, mx, gy + 9, mz + 22, 1.3, 0); frameBox(mx, gy, mz, 50, 1.6, 50, 2.2, 0); }
        else { [-10, 13].forEach(function (oz) { box(mx, gy, mz + oz, 46, 14, 20, 1.9, 0, false); for (a = -23; a <= 23; a += 5.75) { line(mx + a, gy + 14, mz + oz - 10, mx + a, gy + 19, mz + oz, 1.5, 0); line(mx + a, gy + 19, mz + oz, mx + a, gy + 14, mz + oz + 10, 1.5, 0); } line(mx - 23, gy + 19, mz + oz, mx + 23, gy + 19, mz + oz, 1.2, 0); for (q = 0; q < 4; q++) { frameBox(mx - 15 + q * 10, gy, mz + oz - 10.2, 5.5, 6.5, 0.4, 1.1, 0); } }); }   /* twin gable sheds with doors */
        continue; }
      if (r2 < 0.3) {                                    /* open block: a park with paths and trees, or a plaza */
        if (r3 > 0.5) { ring(mx, gy + 0.3, mz, 16, 1.2, 0); ring(mx, gy + 0.3, mz, 6, 1.1, 0); line(mx - 23, gy + 0.3, mz, mx + 23, gy + 0.3, mz, 1.8, 0); line(mx, gy + 0.3, mz - 23, mx, gy + 0.3, mz + 23, 1.8, 0); line(mx, gy, mz, mx, gy + 9, mz, 1.0, 0); }
        else { for (q = 0; q < 14; q++) { var px = mx - 19 + hash(q * 1.3, bx) * 38, pz = mz - 19 + hash(q * 2.1, bz) * 38; line(px, gy, pz, px, gy + 3, pz, 1.5, 0); ring(px, gy + 4.2, pz, 2.2, 1.3, 0); ring(px, gy + 5.6, pz, 1.2, 1.3, 0); } line(mx - 22, gy + 0.3, mz - 22, mx + 22, gy + 0.3, mz + 22, 1.8, 0); }
        continue; }
      var H = (24 + 135 * Math.pow(Math.max(0, 1 - dC / 190), 1.3)) * (0.6 + 0.7 * r1);
      if (r2 < 0.55) { var ph = Math.min(16, H * 0.3);                                                  /* podium, set-back tower, crown and spire */
        floors(mx, gy, mz, 40, 40, ph, 8); floors(mx - 3, gy + ph, mz + 2, 22, 24, H * 0.8, 5.5); floors(mx - 3, gy + ph + H * 0.8, mz + 2, 14, 16, H * 0.12, 0);
        roofKit(mx + 10, gy + ph, mz - 12, 16, 14, r3); if (H > 80) { line(mx - 3, gy + ph + H * 0.92, mz + 2, mx - 3, gy + ph + H * 0.92 + 24, mz + 2, 1.0, 0); } else { roofKit(mx - 3, gy + ph + H * 0.92, mz + 2, 14, 16, r3); } }
      else if (r2 < 0.8) { var h2 = H * (0.5 + 0.4 * r1);                                               /* twin slabs joined by a sky bridge */
        floors(mx - 11, gy, mz, 16, 36, H, 6); floors(mx + 12, gy, mz - 4, 16, 26, h2, 6); roofKit(mx - 11, gy + H, mz, 16, 36, r3); roofKit(mx + 12, gy + h2, mz - 4, 16, 26, 1 - r3);
        frameBox((mx - 3 + mx + 4) / 2, gy + h2 * 0.6, mz - 2, 7, 3.6, 5, 1.1, 0); }
      else if (r3 > 0.5) { var rr2 = 15, hh2 = H * 0.75;                                                /* round tower */
        for (y = 0; y <= hh2 + 0.01; y += 4.2 * OS) { ring(mx, gy + y, mz, rr2, 1.6, 0); } for (q = 0; q < 16; q++) { var an2 = q / 16 * Math.PI * 2; line(mx + Math.cos(an2) * rr2, gy, mz + Math.sin(an2) * rr2, mx + Math.cos(an2) * rr2, gy + hh2, mz + Math.sin(an2) * rr2, 2.2, 0); } ring(mx, gy + hh2, mz, rr2 - 4, 1.2, 0); line(mx, gy + hh2, mz, mx, gy + hh2 + 12, mz, 1.1, 0); }
      else { floors(mx, gy, mz, 34, 30, H * 0.7, 6.8); roofKit(mx, gy + H * 0.7, mz, 34, 30, r3); } } }
    /* elevated rail line across the city on pylons, with one train */
    var ry = PAD_Y + 13, rz = 430 + cell + gap / 2 + 3;
    line(640, ry, rz - 1.4, 920, ry, rz - 1.4, 1.3, 0); line(640, ry, rz + 1.4, 920, ry, rz + 1.4, 1.3, 0); for (a = 648; a <= 920; a += 24) { line(a, PAD_Y, rz, a, ry, rz, 1.4, 0); line(a - 2, ry, rz - 2, a + 2, ry, rz + 2, 1.2, 0); }
    for (q = 0; q < 3; q++) { frameBox(742 + q * 15, ry + 0.6, rz, 13, 4.2, 4, 1.0, 0); line(736 + q * 15, ry + 2.8, rz - 2, 748 + q * 15, ry + 2.8, rz - 2, 1.2, 0); } })();

  FLAG = -1;

  /* ---- data links from the engine (001 and 002) to every other site: flag 3, aRand.x holds t ---- */
  var hub = [SITES[0].x + 36, PAD_Y + 70, SITES[0].z + 6];
  [2, 3, 4, 5, 6].forEach(function (i) { var t = SITES[i], n = Math.round(Math.sqrt((t.x - hub[0]) * (t.x - hub[0]) + (t.z - hub[2]) * (t.z - hub[2])) / (2.2 * OS));
    for (var j = 0; j <= n; j++) { var u = j / n; put(hub[0] + (t.x - hub[0]) * u, hub[1] + (t.th - hub[1] + 24) * u + Math.sin(u * Math.PI) * 95, hub[2] + (t.z - hub[2]) * u, 0, 3, u); } });

  /* ---- the one-take scanning flight: sea, coast, ridge, plain, built area ---- */
  var curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-800, 78, 400), new THREE.Vector3(-580, 78, 455), new THREE.Vector3(-365, 100, 555), new THREE.Vector3(-240, 310, 670),
    new THREE.Vector3(-50, 540, 650), new THREE.Vector3(130, 520, 560), new THREE.Vector3(300, 350, 462), new THREE.Vector3(455, 235, 478), new THREE.Vector3(575, 175, 572)
  ], false, 'centripetal');
  var NS = 240, sx = new Float32Array(NS), sz = new Float32Array(NS), cpt = new THREE.Vector3(), ctan = new THREE.Vector3(), ctan2 = new THREE.Vector3();
  for (var si2 = 0; si2 < NS; si2++) { curve.getPointAt(si2 / (NS - 1), cpt); sx[si2] = cpt.x; sz[si2] = cpt.z; }
  var etx = sx[NS - 1] - sx[NS - 5], etz = sz[NS - 1] - sz[NS - 5], etl = Math.sqrt(etx * etx + etz * etz), pathLen = curve.getLength(), cityEnd = 1; etx /= etl; etz /= etl;
  /* scan position for every point: the distance along the flight path of the nearest point on it, found on a finely sampled copy of the path so it varies smoothly,
     plus how much the scan fans out or bunches up there (from the path's curvature), which is used to keep the line the same width on the ground everywhere */
  var count = P.length / 3, SA = new Float32Array(count), SW = new Float32Array(count);
  var NF = 2400, fx = new Float32Array(NF), fz = new Float32Array(NF), fang = new Float32Array(NF), fk = new Float32Array(NF), dsF = pathLen / (NF - 1), fi2;
  for (fi2 = 0; fi2 < NF; fi2++) { curve.getPointAt(fi2 / (NF - 1), cpt); fx[fi2] = cpt.x; fz[fi2] = cpt.z; }
  for (fi2 = 0; fi2 < NF - 1; fi2++) { var ang = Math.atan2(fz[fi2 + 1] - fz[fi2], fx[fi2 + 1] - fx[fi2]); if (fi2 > 0) { while (ang - fang[fi2 - 1] > Math.PI) { ang -= 2 * Math.PI; } while (ang - fang[fi2 - 1] < -Math.PI) { ang += 2 * Math.PI; } } fang[fi2] = ang; } fang[NF - 1] = fang[NF - 2];
  for (fi2 = 0; fi2 < NF; fi2++) { var k0 = Math.max(0, fi2 - 30), k1 = Math.min(NF - 1, fi2 + 30); fk[fi2] = (fang[k1] - fang[k0]) / ((k1 - k0) * dsF); }
  for (var pi = 0; pi < count; pi++) { var qx = P[pi * 3], qz = P[pi * 3 + 2], best = 1e12, bi2 = 0, j, dx, dz, dq;
    for (j = 0; j < NF; j += 20) { dx = qx - fx[j]; dz = qz - fz[j]; dq = dx * dx + dz * dz; if (dq < best) { best = dq; bi2 = j; } }
    var j0 = Math.max(0, bi2 - 22), j1 = Math.min(NF - 1, bi2 + 22); for (j = j0; j <= j1; j++) { dx = qx - fx[j]; dz = qz - fz[j]; dq = dx * dx + dz * dz; if (dq < best) { best = dq; bi2 = j; } }
    var bestS = 1e12, par = 0, dsg = 0, kk = fk[bi2];
    for (j = Math.max(0, bi2 - 1); j <= Math.min(NF - 2, bi2); j++) { var ax = fx[j], az = fz[j], bx = fx[j + 1] - ax, bz = fz[j + 1] - az, bl = bx * bx + bz * bz, t = ((qx - ax) * bx + (qz - az) * bz) / bl; t = t < 0 ? 0 : (t > 1 ? 1 : t);
      var ex = qx - ax - bx * t, ez = qz - az - bz * t, d2 = ex * ex + ez * ez; if (d2 < bestS) { bestS = d2; par = (j + t) / (NF - 1); var bln = Math.sqrt(bl); dsg = (ex * -bz + ez * bx) / bln; } }
    var gg = 1 - kk * dsg; gg = gg < 0.77 ? 1.3 : 1 / gg;
    if (par >= 0.99999) { var dE = (qx - fx[NF - 1]) * etx + (qz - fz[NF - 1]) * etz; if (dE > 0) { par = 1 + dE / pathLen; gg = 1; } }
    SA[pi] = par; SW[pi] = gg < 0.03 ? 0.03 : (gg > 1.3 ? 1.3 : gg);
    if (M[pi * 2] === 0 && M[pi * 2 + 1] === 6 && par > cityEnd) { cityEnd = par; } }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('aScan', new THREE.BufferAttribute(SA, 1));
  geo.setAttribute('aScanW', new THREE.BufferAttribute(SW, 1));
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(new Float32Array(R), 3));
  geo.setAttribute('aMeta', new THREE.BufferAttribute(new Float32Array(M), 2));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 3000);
  P = R = M = null;

  var uniforms = {
    uTime: { value: 0 }, uSize: { value: opts.pointSize || 170 }, uPix: { value: opts.pixelRatio || 1 },
    uFocus: { value: [1, 0, 0, 0, 0, 0, 0, 0] }, uShow: { value: [1, 1, 1, 1, 1, 1, 1, 1] }, uIso: { value: 0 }, uIsoG: { value: 0 }, uAgri: { value: 0 }, uLinks: { value: 0 }, uScan: { value: 0 }, uBandK: { value: 1 }, uQuiet: { value: new THREE.Vector2(0, 0) }, uTop: { value: new THREE.Vector2(0.02, 0.42) },
    uInk: { value: new THREE.Color(0x0E1116) }, uTer: { value: new THREE.Color(0x8E97A3) }, uTerB: { value: new THREE.Color(0x8E97A3) }, uRaw: { value: new THREE.Color(0xB9C0C9) },
    uBlue: { value: new THREE.Color(0x3179CB) }, uBg: { value: new THREE.Color(0xF6F8FA) }, uFog: { value: new THREE.Vector2(520, 1500) }, uCalm: { value: new THREE.Vector3(-520, 50, 250) }
  };
  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: [
      'attribute vec3 aRand; attribute vec2 aMeta; attribute float aScan; attribute float aScanW;',
      'uniform float uTime, uSize, uPix, uLinks, uScan, uBandK; uniform float uFocus[8]; uniform float uShow[8]; uniform float uIso, uIsoG, uAgri; uniform vec2 uQuiet, uFog, uTop; uniform vec3 uCalm;',
      'uniform vec3 uInk, uTer, uTerB, uRaw, uBlue, uBg;',
      'varying vec3 vColor;',
      'void main(){',
      '  int si = int(aMeta.x + 0.5);',
      '  float flag = aMeta.y;',
      '  float isObj = step(0.5, aMeta.x);',
      '  float water = step(1.5, flag) * (1.0 - step(2.5, flag));',
      '  float link = step(2.5, flag) * (1.0 - step(3.5, flag));',
      '  float hi = step(3.5, flag) * (1.0 - step(5.5, flag));',
      '  float fieldp = step(5.5, flag) * (1.0 - step(6.5, flag));',
      '  float faint = step(6.5, flag);',
      '  float edge = step(0.5, flag) * (1.0 - step(1.5, flag));',
      '  float f = 1.0; if (si > 0) { f = uFocus[si]; }',
      '  float raw = 1.0 - f;',
      '  vec3 p = position;',
      '  float w1 = p.x * 0.085 + p.z * 0.02 - uTime * 1.5, w2 = p.x * 0.19 - p.z * 0.07 - uTime * 2.3, w3 = p.x * 0.41 + p.z * 0.23 - uTime * 3.4;',
      '  float calm = mix(0.5, 1.0, smoothstep(uCalm.z * 0.75, uCalm.z * 1.35, distance(position.xz, uCalm.xy)));',
      '  float wy = (2.6 * sin(w1) + 1.3 * sin(w2) + 0.55 * sin(w3)) * calm;',
      '  float crest = water * smoothstep(1.0 * calm, 3.6 * calm, wy) * mix(0.55, 1.0, (calm - 0.5) * 2.0);',
      '  float onLine = (1.0 - isObj) * exp(-abs(aScan - uScan) / (0.006 * aScanW)) * uBandK;',
      '  p.y += water * wy * (1.0 - 0.75 * onLine); p.x -= water * calm * (1.9 * cos(w1) + 0.8 * cos(w2)) * (1.0 - onLine); p.z += water * calm * 0.5 * cos(w2) * (1.0 - onLine);',
      '  p += isObj * (aRand * vec3(52.0, 26.0, 52.0) * raw * raw + vec3(0.0, raw * (20.0 + 26.0 * abs(aRand.z)), 0.0));',
      '  float ground = (1.0 - isObj) * (1.0 - link);',
      '  float ahead = ground * smoothstep(-0.006, 0.03, aScan - uScan);',
      '  float band = ground * exp(-abs(aScan - uScan) / (0.003 * aScanW)) * uBandK;',
      '  p += aRand * vec3(5.0, mix(4.0, 1.0, water), 5.0) * ahead * (1.0 - hi * 0.6) * (1.0 - band);',
      '  p.y += band * 2.5;',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position = projectionMatrix * mv;',
      '  float dist = -mv.z;',
      '  float s = clamp(uSize / dist, 1.0, 2.8) * mix(1.0, 1.55, isObj * f) * (1.0 + band * 1.3) * mix(1.0, 0.85, ahead) * (1.0 + hi * 0.45 + fieldp * 0.15 + crest * 0.5);',
      '  vec3 c = mix(uTer, mix(uTer, uBg, 0.45), water);',
      '  c = mix(c, uInk, crest * 0.85);',
      '  c = mix(c, mix(uTer, uInk, 0.8), hi);',
      '  c = mix(c, mix(uTer, uInk, 0.85), fieldp);',
      '  c = mix(c, mix(uTerB, uBg, 0.36), faint);',
      '  float wA = max(smoothstep(150.0, 300.0, position.z), 1.0 - smoothstep(380.0, 620.0, distance(position.xz, vec2(780.0, 570.0))));',
      '  float level = mix(mix(mix(0.7, 0.97, uAgri), 0.2, wA), mix(0.6, 0.7, faint), smoothstep(16.0, 120.0, position.y));',
      '  float landp = ground * (1.0 - water) * (1.0 - hi) * (1.0 - fieldp);',
      '  c = mix(c, uBg, (1.0 - level) * landp);',
      '  c = mix(c, uBg, 0.45 * hi * ground);',
      '  c = mix(c, uBg, 0.3 * fieldp);',
      '  c = mix(c, mix(uInk, uRaw, raw), isObj);',
      '  c = mix(c, uBlue, edge * isObj * f);',
      '  c = mix(c, mix(c, uBg, 0.38), ahead);',
      '  c = mix(c, uBlue, clamp(band * 1.3, 0.0, 1.0));',
      '  float fog = smoothstep(uFog.x, uFog.y, dist);',
      '  vec2 ndc = gl_Position.xy / gl_Position.w;',
      '  float quiet = max(uQuiet.x * (1.0 - smoothstep(-0.34, 0.08, ndc.x)), uQuiet.y * smoothstep(uTop.x, uTop.y, ndc.y));',
      '  if (link > 0.5) {',
      '    float on = step(aRand.x, uLinks) * step(0.001, uLinks);',
      '    float dash = step(0.45, fract(aRand.x * 14.0 - uTime * 0.5));',
      '    c = uBlue; s = 1.6 + 1.6 * dash; fog *= 0.5; quiet *= 0.6;',
      '    if (on < 0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }',
      '  }',
      '  float show = 1.0; if (si > 0) { show = uShow[si]; }',
      '  float hide = isObj * (1.0 - show) + ground * (water * uIsoG * 0.3 + fieldp * uIso * 0.9) + link * uIso;',
      '  vColor = mix(c, uBg, clamp(max(max(fog, quiet * 0.96), hide), 0.0, 1.0));',
      '  gl_PointSize = s * uPix * (1.0 - quiet * 0.5) * (1.0 - 0.6 * isObj * (1.0 - show));',
      '}'
    ].join('\n'),
    fragmentShader: 'precision mediump float; varying vec3 vColor; void main(){ gl_FragColor = vec4(vColor, 1.0); }'
  });
  var points = new THREE.Points(geo, mat); points.frustumCulled = false;
  var scene = new THREE.Scene(); scene.add(points);

  /* ---- the focus frame: the logo square as a viewfinder that locks onto each site ---- */
  var frame = new THREE.Group(), blue = new THREE.MeshBasicMaterial({ color: 0x3179CB, transparent: true, depthWrite: false });
  var bars = []; for (var bi = 0; bi < 4; bi++) { var m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), blue); frame.add(m); bars.push(m); }
  var veil = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x3179CB, transparent: true, opacity: 0.03, depthWrite: false, depthTest: false, side: THREE.DoubleSide }));
  frame.add(veil); scene.add(frame);
  function sizeFrame(S, T) { bars[0].scale.set(T, S + T, T); bars[0].position.set(-S / 2, 0, 0); bars[1].scale.set(T, S + T, T); bars[1].position.set(S / 2, 0, 0);
    bars[2].scale.set(S + T, T, T); bars[2].position.set(0, S / 2, 0); bars[3].scale.set(S + T, T, T); bars[3].position.set(0, -S / 2, 0); veil.scale.set(S, S, 1); }

  var camera = new THREE.PerspectiveCamera(46, 16 / 9, 2, 6000);

  /* ---- timeline: holds (text visible, camera orbits slowly) joined by travel ---- */
  var HOLDS = [];
  function polar(tx, ty, tz, dist, h, az) { return { t: [tx, ty, tz], dist: dist, h: h, az: az }; }
  var S_END = 0.33;
  HOLDS.push({ id: 'hero', a: 0, b: 0.045, tb: 0.09, cam: polar(0, 0, 0, 100, 30, 0), fc: [0, 0, 0], fr: 0.3 });
  HOLDS.push({ id: 'pos', a: 0.15, b: 0.205, cam: polar(0, 0, 0, 100, 30, 0), fc: [0, 0, 0], fr: 0.3 });
  var ORDER = opts.order || [0, 1, 2, 3, 4, 5, 6];
  ORDER.forEach(function (si, i) { var st = SITES[si], a = S_END + i * 0.07 + 0.04;
    HOLDS.push({ id: 's' + i, site: si, a: a, b: a + 0.03, cam: polar(st.x + (st.ox || 0), st.th, st.z + (st.oz || 0), st.dist, st.h, st.az), fc: [st.x + (st.ox || 0), st.th + st.fy, st.z + (st.oz || 0)], fr: 0.74 }); });
  HOLDS.push({ id: 'int', a: 0.85, b: 0.885, cam: polar(110, 10, 40, 640, 420, 3.3), fc: [85, 50, 30], fr: 0.46, dark: 1 });
  HOLDS.push({ id: 'src', a: 0.906, b: 0.975, cam: polar(-5, 10, 110, 1240 / 1.5, 460 / 1.5, 1.86), fc: [-5, 10, 110], fr: 0.9, dark: 1, pan: 0.6, p0: 0.9164 });
  function seg(a, b, x) { return clamp((x - a) / (b - a)); }
  function scanU(p) { if (p < 0.045) { return 0.03 * seg(0, 0.045, p); } if (p < 0.15) { return 0.03 + 0.37 * ease(seg(0.045, 0.15, p)); }
    if (p < 0.205) { return 0.40 + 0.05 * seg(0.15, 0.205, p); } return 0.45 + 0.55 * ease(seg(0.205, S_END, p)); }
  var P35 = 0.3364, P36 = 0.347, PC = 0.3, scanValue;
  var LEAD = 0.2, GATE = 150, qGate = new THREE.Quaternion(), mGate = new THREE.Matrix4(), vUp = new THREE.Vector3(0, 1, 0), vA = new THREE.Vector3(), vB = new THREE.Vector3();
  function scanPose(p, time) {
    var u = scanU(p); curve.getPointAt(u, cpt); var pos = [cpt.x, cpt.y, cpt.z];
    curve.getTangentAt(u, ctan); curve.getTangentAt(Math.min(1, u + 0.04), ctan2);
    var roll = Math.max(-0.2, Math.min(0.2, (ctan.z * ctan2.x - ctan.x * ctan2.z) * 0.8)) * sstep(0.06, 0.14, p);
    var lu = Math.min(1, u + 0.17); curve.getPointAt(lu, vA);
    var gT = Math.max(0, ground(vA.x, vA.z)) + 12, yT = Math.min(vA.y, cpt.y) - 8; var dn = 0.62 + 0.3 * sstep(0.2, 0.32, u) * (1 - sstep(0.52, 0.66, u)); var tgt = [vA.x, yT + (gT - yT) * dn, vA.z], fT = [CITY[0], 50, CITY[1]], kE = sstep(0.8, 1, u);
    tgt = [tgt[0] + (fT[0] - tgt[0]) * kE, tgt[1] + (fT[1] - tgt[1]) * kE, tgt[2] + (fT[2] - tgt[2]) * kE];
    var gu = Math.min(1, u + LEAD); curve.getPointAt(gu, vA); curve.getTangentAt(gu, vB);
    var gy = Math.max(0, ground(vA.x, vA.z)) + GATE / 2 - 18;
    vB.y = 0; vB.normalize(); mGate.lookAt(new THREE.Vector3(0, 0, 0), vB, vUp); qGate.setFromRotationMatrix(mGate);
    return { pos: pos, tgt: tgt, roll: roll, fc: [vA.x, gy, vA.z], scan: u + LEAD, u: u };
  }
  (function () { var lo = 0.205, hi = S_END; for (var it = 0; it < 30; it++) { var md = (lo + hi) / 2; if (scanU(md) + LEAD < 1) { lo = md; } else { hi = md; } } PC = hi; })();
  scanValue = function (p) { if (p <= PC) { return scanU(p) + LEAD; } var far = cityEnd + 0.004; if (p <= P35) { return 1 + (far - 1) * (p - PC) / (P35 - PC); } return far + 0.5 * (p - P35) / (P36 - P35); };
  function camAt(hd, local, time, pNow) {
    var c = hd.cam, az = c.az + (hd.orb || 0.2) * (local - 0.5) + 0.012 * Math.sin(time * 0.35);
    if (hd.pan) { az = c.az + hd.pan * clamp(((pNow === undefined ? hd.a : pNow) - hd.p0) / (1 - hd.p0)); }
    return [c.t[0] + Math.sin(az) * c.dist, c.t[1] + c.h, c.t[2] + Math.cos(az) * c.dist];
  }
  function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  var LIGHT = { bg: [246, 248, 250], ink: [14, 17, 22], ter: [142, 151, 163], raw: [185, 192, 201] };
  var DARK = { bg: [9, 12, 17], ink: [233, 238, 243], ter: [88, 97, 110], raw: [60, 68, 80] };
  var fPos = new THREE.Vector3(), tmp = new THREE.Vector3();

  function update(p, time, px, py, portrait, vw, vh, ho) {
    var i, pos, tgt, fc, fr, fs, hold = -1, local = 0, travel = 0, n = HOLDS.length, roll = 0, gateMix = 0, scanV = 9, zone = -1, bandK = 0;
    var first = HOLDS[2];
    if (p < first.a) {
      var sp = scanPose(Math.min(p, S_END), time); scanV = scanValue(p); bandK = 1 - sstep(P35, P36, p); roll = sp.roll;
      zone = sp.pos[0] < -300 ? 0 : (sp.u > 0.9 ? 3 : (sp.pos[0] > 300 ? 2 : 1));
      if (p <= S_END) { pos = sp.pos; tgt = sp.tgt; fc = sp.fc; gateMix = 1; }
      else { travel = ease((p - S_END) / (first.a - S_END)); var pb0 = camAt(first, 0, time);
        pos = lerp3(sp.pos, pb0, travel); pos[1] += Math.sin(travel * Math.PI) * 130; tgt = lerp3(sp.tgt, first.cam.t, travel);
        fc = lerp3(sp.fc, first.fc, travel); gateMix = 1 - travel; roll *= (1 - travel); }
      fr = first.fr;
    } else {
      for (i = 2; i < n; i++) { if (p >= HOLDS[i].a && p <= HOLDS[i].b) { hold = i; local = (p - HOLDS[i].a) / (HOLDS[i].b - HOLDS[i].a); break; } }
      if (hold >= 0) { var hd = HOLDS[hold]; pos = camAt(hd, local, time, p); tgt = hd.cam.t.slice(); fc = hd.fc; fr = hd.fr; }
      else if (p > HOLDS[n - 1].b) { var last = HOLDS[n - 1], u = ease(clamp((p - last.b) / (1 - last.b)));
        pos = camAt(last, 1, time, p); tgt = last.cam.t.slice(); fc = last.fc; fr = last.fr; }
      else { for (i = 2; i < n - 1; i++) { if (p > HOLDS[i].b && p < HOLDS[i + 1].a) { break; } }
        var A = HOLDS[i], B = HOLDS[i + 1]; travel = ease((p - A.b) / (B.a - A.b));
        var pa = camAt(A, 1, time), pb = camAt(B, 0, time); pos = lerp3(pa, pb, travel);
        var dd = Math.sqrt((pb[0] - pa[0]) * (pb[0] - pa[0]) + (pb[2] - pa[2]) * (pb[2] - pa[2]));
        pos[1] += Math.sin(travel * Math.PI) * Math.min(330, dd * 0.26);
        tgt = lerp3(A.cam.t, B.cam.t, travel); fc = lerp3(A.fc, B.fc, travel); fr = A.fr + (B.fr - A.fr) * travel; }
    }
    uniforms.uScan.value = scanV; uniforms.uBandK.value = bandK;
    var gh = ground(pos[0], pos[2]); if (pos[1] < gh + 22) { pos[1] = gh + 22; }

    /* focus per site: it assembles as the frame arrives and stays assembled */
    var focus = uniforms.uFocus.value;
    ORDER.forEach(function (si, k) { var a = HOLDS[k + 2].a; focus[si + 1] = ease(sstep(a - 0.04, a + 0.006, p));  });
    uniforms.uLinks.value = sstep(0.825, 0.88, p); uniforms.uFog.value.set(520 + 380 * sstep(0.885, 0.91, p), 1500 + 900 * sstep(0.885, 0.91, p));
    var iso = sstep(S_END, HOLDS[2].a, p) * (1 - sstep(HOLDS[8].b, HOLDS[9].a, p)), show = uniforms.uShow.value, vis = [0, 0, 0, 0, 0, 0, 0, 0];
    if (p >= S_END && p <= HOLDS[9].a) { if (hold >= 2 && hold <= 8) { vis[HOLDS[hold].site + 1] = 1; }
      else { for (i = 1; i < 9; i++) { if (p > HOLDS[i].b && p < HOLDS[i + 1].a) { var tv = ease((p - HOLDS[i].b) / (HOLDS[i + 1].a - HOLDS[i].b));
        if (HOLDS[i].site !== undefined) { vis[HOLDS[i].site + 1] = 1 - sstep(0.1, 0.6, tv); } if (HOLDS[i + 1].site !== undefined) { vis[HOLDS[i + 1].site + 1] = Math.max(vis[HOLDS[i + 1].site + 1], sstep(0.25, 0.8, tv)); } break; } } } }
    for (i = 1; i < 8; i++) { show[i] = 1 + (vis[i] - 1) * iso; }
    uniforms.uIso.value = iso; uniforms.uIsoG.value = iso * (1 - 0.9 * vis[6]); uniforms.uAgri.value = iso * vis[6];

    /* text windows: one chapter at a time */
    var chap = -1, o = 0;
    for (i = 0; i < n; i++) { var h2 = HOLDS[i], tb = h2.tb || h2.b, v = (i === 0 ? 1 : sstep(h2.a - 0.014, h2.a + 0.006, p)) * (1 - sstep(tb - 0.002, tb + 0.016, p)); if (v > o) { o = v; chap = i; } }
    var topMode = chap === 0 || portrait;
    uniforms.uQuiet.value.set(topMode ? 0 : o, (topMode && chap !== 0) ? o : 0);
    if (chap === 0 && !portrait) { uniforms.uTop.value.set(0.12, 0.52); } else { uniforms.uTop.value.set(0.02, 0.42); }

    camera.fov = (portrait ? 62 : 46) + 12 * gateMix;
    camera.position.set(pos[0] + px * 14, pos[1] - py * 8, pos[2]);
    camera.up.set(0, 1, 0); camera.lookAt(tgt[0], tgt[1], tgt[2]); if (roll) { camera.rotateZ(roll); }
    /* keep the subject clear of the text: shift it right on wide screens, down on tall ones */
    if (vw && vh) { var k2 = chap === 0 ? 0 : o, ox = 0, oy = 0;
      if (portrait) { oy = vh * 0.16 * k2; } else { ox = vw * 0.17 * k2; oy = 0; }
      if (ho) { ox = ox * (1 - ho.k) + ho.x * ho.k; oy = oy * (1 - ho.k) + ho.y * ho.k; }
      camera.setViewOffset(vw, vh, -ox, -oy, vw, vh); }
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();

    var dist = Math.sqrt((pos[0] - fc[0]) * (pos[0] - fc[0]) + (pos[1] - fc[1]) * (pos[1] - fc[1]) + (pos[2] - fc[2]) * (pos[2] - fc[2]));
    var aspect = vw / vh;
    var compactLandscape = vw <= 1280 && vh <= 900 && aspect >= 0.8 && aspect < 1.6;
    var frameScale = compactLandscape ? 0.6 : (portrait ? camera.aspect * 0.9 : 1);
    fs = fr * 2 * dist * Math.tan(camera.fov * Math.PI / 360) * frameScale;
    fs = fs + (GATE - fs) * gateMix;
    var fvis = sstep(0.3575, 0.3735, p) * (1 - sstep(0.8321, 0.848, p)); frame.visible = fvis > 0.002; blue.opacity = fvis; veil.material.opacity = 0.03 * fvis;
    sizeFrame(fs, Math.max(0.4, dist * 0.0024));
    frame.position.set(fc[0], fc[1], fc[2]); frame.quaternion.copy(camera.quaternion); if (gateMix > 0) { frame.quaternion.slerp(qGate, gateMix); }
    /* top-left corner of the frame in screen space, for the label */
    fPos.set(-fs / 2, fs / 2, 0).applyQuaternion(camera.quaternion).add(frame.position).project(camera);
    tmp.set(fs / 2, fs / 2, 0).applyQuaternion(camera.quaternion).add(frame.position).project(camera);

    uniforms.uTime.value = time;
    var dark = opts.alwaysDark ? 1 : sstep(0.8, 0.84, p) * (1 - sstep(0.978, 0.996, p));
    function mx(a, b) { return [a[0] + (b[0] - a[0]) * dark, a[1] + (b[1] - a[1]) * dark, a[2] + (b[2] - a[2]) * dark]; }
    var bg = mx(LIGHT.bg, DARK.bg), ink = mx(LIGHT.ink, DARK.ink), ter = mx(LIGHT.ter, DARK.ter), raw = mx(LIGHT.raw, DARK.raw);
    uniforms.uTerB.value.setRGB(ter[0] / 255, ter[1] / 255, ter[2] / 255);
    if (opts.alwaysDark) { ter = lerp3(ter, [176, 186, 200], gateMix); }
    uniforms.uBg.value.setRGB(bg[0] / 255, bg[1] / 255, bg[2] / 255); uniforms.uInk.value.setRGB(ink[0] / 255, ink[1] / 255, ink[2] / 255);
    uniforms.uTer.value.setRGB(ter[0] / 255, ter[1] / 255, ter[2] / 255); uniforms.uRaw.value.setRGB(raw[0] / 255, raw[1] / 255, raw[2] / 255);
    return { dark: dark, bg: bg, ink: ink, chap: chap, o: o, scanning: gateMix, zone: zone, site: (chap >= 2 && chap <= 8) ? chap - 2 : -1,
      label: { x: (fPos.x + 1) / 2, y: (1 - fPos.y) / 2, w: (tmp.x - fPos.x) / 2, front: fPos.z < 1 } };
  }
  return { scanInfo: function () { return { cityEnd: cityEnd, PC: PC, pathLen: pathLen }; }, scene: scene, camera: camera, uniforms: uniforms, update: update, count: count, holds: HOLDS, sites: SITES };
}
/*CORE-END*/
if (typeof module !== 'undefined') { module.exports = createWorld; }
