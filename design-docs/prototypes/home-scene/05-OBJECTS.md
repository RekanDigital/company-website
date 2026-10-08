# 05 Objects

Source: the blocks marked `/* ---- 001 ... */` to `/* ---- 007 ... */` and the city block in `source/world.js`. Exact dimensions are in the code. This file says what each object is made of and what must stay recognisable.

All objects are built from points with a small set of helpers: `line`, `ring`, `box` (solid walls drawn as stacked outlines), `frameBox` (edges only), `cyl`, `tower`, `tunnel`, `dish`. Positions are relative to the object's map position in `01-MAP.md`. Objects on a pad stand at height 8.

The block numbers in the source follow an older order. The visiting order on the page is in `02-SCROLL-TIMELINE.md`.

## Technology & Digitalization (`tech`)

One building, one parabolic antenna, one tower. Do not add or remove any of the three.

- **Tower:** lattice mast 150 high tapering from 13 to 2.5 wide, a central core, three service platforms with railings, four blue light rings, six sector antenna panels near the top, four relay drums, a spire with a beacon, a cable bridge to the building.
- **Building:** a podium and a set-back upper level with blue-lit parapets, vertical fins, a mid-height blue band, three roof plant units, two radomes, a four-row solar array, an entrance canopy.
- **Antenna:** one dish of radius 20 on a pedestal and yoke on the upper roof. Sixteen ribs, blue rim and mid-ring, a tripod feed with a sub-reflector.
- The blue links start just above the dish, at (76, 78, 18).

## Data & Business Intelligence (`data`)

Detailed data centres plus one cylindrical business office. The office must stay low so it does not compete with the tower beside it.

- **Office:** a glazed drum, radius 17, 40 high, drawn floor by floor with mullions, a blue band every third floor, a canopy ring on columns, a roof terrace with a small plant drum and mast.
- **Three data halls,** each 88 by 24 and 13 high: solid walls with a blue status band, louvred vents, fourteen roof coolers with blue fan rings, a ridge duct, a generator block with three exhausts, pipe bridges to the next hall.
- **Chiller yard** of four tanks and a **substation** of three transformers.

## General Trading & Supply Chain (`trading`)

A supply chain in one line from land to water. The order must stay: trucks, warehouse, containers, rail, dock, ships.

- **Three articulated trucks:** ribbed trailer, cab with windscreen and bonnet, ten wheels, landing gear, exhaust. Cabs point inland.
- **Warehouse:** solid, 40 by 112 and 17 high, with a two-storey office, five roof lights, seven dock doors on the landward face, a canopy.
- **Container yard:** three rows of four stacks, one to three high, under one yard crane with a container on its hook. Containers are drawn lightly on purpose, so they do not read as white blocks.
- **Rail siding:** sleepered track, a locomotive and three loaded wagons.
- **Dock:** a narrow deck drawn as an outline only, one row of piles on the seaward edge, bollards. Kept simple so it does not hide the ships.
- **Two slim ship-to-shore cranes:** legs, A-frame, a boom out over the water, a small container on the hook.
- **Two cargo ships:** tall hull in close-set lines with a pointed bow, container bays on deck, bridge and funnel at the stern. One is moored under the cranes, one stands off in clear water.

## Fisheries, Seaweed & Blue Economy (`fisheries`)

At sea, in calmed water.

- **Twelve seaweed lines:** poles every 26 units with float buoys, twin ropes, hanging fronds, anchor lines at both ends. Two harvest rafts with drying racks beside them.
- **Six net pens** in two rows of three: double collar, handrail on posts, net walls down to a weighted ring, a bird net over the top. A walkway along each row leads to a feed barge with a silo.
- **Jetty** on cross-braced piles reaching toward the shore: plank deck, handrails, bollards, ladder, hoist, fish crates, and a gabled landing shed with a door and windows.
- **Four fishing boats:** ribbed hull, plank deck, bow rail, wheelhouse with windows and roof, mast with crosstree and light, twin outrigger booms, a net drum and a trailing net.

## Health & Bioscience (`health`)

- **Five growing tunnels,** each 126 long: end frames with doors, base rails, purlins, ridge vents, two rows of plants inside.
- **Glass greenhouse:** mullioned walls, four ridged roof spans with blue ridge lines and open vents, benches with plants, an irrigation line over each bench, a door.
- **Lab building,** 44 by 62 and 22 high: window bands on two floors, vertical fins, an entrance porch, four roof plant units with fans, three fume exhausts, a skylight.
- **Four tanks:** two blue level bands each, rim rail, ladder, base ring, vent, pipework to the lab.
- Plants are small silhouettes: a stem with four leaves.

## Agriculture & Green Economy (`agri`)

This object is part of the land, not a building on a pad.

- **Terraced slope:** the stepped ground from `01-MAP.md`, with a blue line along every terrace edge.
- **Six striped field plots** on the low ground, each outlined in blue, with rows running one of two ways.
- **Four small sheds** standing beside the plots.
- No plot or terrace may come within 60 to 70 units of the beach line, and no shed may stand on a plot.

## Food & Beverage (`fnb`)

A processing plant.

- **Grain silos** with an elevator.
- **Process hall** with a sawtooth roof.
- **Dispatch warehouse.**
- **Four delivery vans** backed up to the warehouse: one-piece body with a panelled load box, sliding door, cab door and window, twin rear doors, four wheels, headlights. They must read as vans, not as the lorries at General Trading.
- **Tanks** and a **stack**.

## City and industrial quarter (context)

Not a business object. Never framed, always dimmer than the seven.

- **City blocks:** towers with floor lines and mullions, roof kits (plant boxes, water tank, mast or helipad), set-back towers with a crown and spire, twin slabs joined by a sky bridge, a round tower.
- **Streets:** a kerb line round every block and a dashed centre line down every street.
- **Open blocks:** plazas with ring paving, or parks with trees.
- **Elevated rail line** on pylons with a three-car train.
- **Industrial quarter** on the south side: sawtooth factories with doors, a stack and a pipe rack; tank farms with rim rails and spiral stairs; twin gable sheds with doors.
