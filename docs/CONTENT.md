# Content Sources - Armtronix site

> Oct 2026 pivot: the challenge brief links `armtronix.com`, which is the
> Malaysian Armtronix Group (Engineered Intelligence infrastructure). All
> page copy is now sourced from armtronix.com (fetched Oct 2026) and lives in
> `src/data/company.js`. The earlier `armtronix.net` IIoT draft is superseded;
> `src/data/products.js` is retained but unused.

All copy is traceable. No invented specs. Numbers in quotes are verbatim or clearly labelled as estimates.

## 1. Challenge brief PDF
File: `Internal Creative UI-UX & Frontend Challenge Brief.docx.pdf`, Brand 2.
- Indian technology firm: Industrial IoT (IIoT), automation controllers, robotics, custom sensor interfaces, PLCs, Industry 4.0 smart factory deployments.
- UX must feel precision-engineered, dependable, cutting-edge; bridge physical boards/MCUs/factory components with live cloud telemetry; dark-mode aesthetic, circuit line art, interactive sensor widgets, B2B funnel for buyers/engineers.
- Avoid flat SaaS pages that hide hardware reality.
- Note: brief links `armtronix.com` - that domain now serves a Malaysian infra group. The live Indian IIoT catalogue is `armtronix.net`. This discrepancy is disclosed in the footer and rationale.

## 2. Official site - https://armtronix.net
- Homepage: “Indian company recognized for reliable industrial automation… design, develop, and manufacture… IIoT, PLCs, robotics… optimize performance, reduce human error, adopt Industry 4.0.”
- Products: Master Control Unit (multi-DAQ aggregation); Retro → IIoT (no re-cabling for remote monitoring/control); Indusπ (IIoT automation device); Modular 4 DIO (4 DIO + 8 programmable IO for Master devices); Improvar (image-processing variant); Presenter (barcode/RFID + TV/monitor displays).
- Indusπ spec page `/products/product4`: field-programmable; concurrent sensor + DAQ/edge ingest; local compute + local DB; LAN + cloud transfer; protocol translation; HMI ports (monitor/Smart TV/touchscreen); Node-RED compatible; specs 2× Ethernet, 2× USB 2.0, 1× USB-C, 4× DI, 4× DO, WiFi optional, MicroSD, HDMI.
- About page: Armtronix = Automation Robotics Mecha Tronix IoT Pvt. Ltd., founded 2021, selected for MeitY TIDE 2.0 at KLE Technological University, Vidyanagar, Hubballi. Mission: optimal management of techno systems via automation/robotics/mechatronics; cost-effective data-driven control. Vision: global leader in industrial automation. Milestones: MeitY selection, global innovation recognition, cost-effective product range launch.
- Testimonials (verbatim excerpts used in Factory section): production & efficiency monitoring + idle-time monitoring quote; bending-machine utilization quote; multi-line TV-display requirement quote.

## 3. LinkedIn - Armtronix IoT Pvt. Ltd.
- `linkedin.com/company/armtronix-iot-pvt-ltd` (~646 followers): Hubballi + Hyderabad, 9 employees, founded 2021, directors Hemanth M Surakod & Naren Nagesh Nayak, phone +91-905-251-9957, stack CUDA/Flask/JS/MongoDB/OpenCV/Python/Raspberry Pi.
- Jun 27, 2026 post: PLC-like device - isolated RS485, 8 DI, 8 relay, RTC, Arduino-compatible, RGB LED, WiFi, Ethernet.
- Apr 1/7, 2026 posts: IPC-Mini as CNC monitoring; OEE / idle-time / downtime / loss-mapping hashtags.
- Dec 2023: MCU launched by Dr. Ekroop Caur (IAS) at Techceleration 2023 Belagavi (KDEM). Apr 2025: demo to MeitY Joint Director Anurag Kumar via KLE CTIE.
- Milestones + 2026 PLC specs used in Conversion timeline and Products grid with `linkedin.com/company/...` as source link.

## 4. What was estimated (labelled in UI)
- OEE calculator `32% idle-cut` assumption - labelled “conservative estimate” next to the result.
- Telemetry values/bases (62 °C, 2.4 mm/s, 7.8 kW, 78% OEE) - labelled “Simulated 1 Hz MQTT feed.”
