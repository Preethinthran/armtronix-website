// Canonical company content - sourced from challenge PDF brief + armtronix.net + LinkedIn.
// See docs/CONTENT.md for source links. Do not invent specs.

export const company = {
  fullName: 'Armtronix IoT Pvt. Ltd.',
  expansion: 'Automation · Robotics · Mecha-tronix',
  founded: 2021,
  hq: 'KLE Technological University, Vidyanagar, Hubballi, Karnataka, India',
  offices: ['Hubballi, Karnataka', 'Hyderabad, India'],
  phone: '+91-905-251-9957',
  site: 'https://armtronix.net',
  linkedin: 'https://www.linkedin.com/company/armtronix-iot-pvt-ltd',
  founders: ['Hemanth M Surakod', 'Naren Nagesh Nayak'],
  incubation: 'TIDE 2.0 · MeitY, Govt. of India · KLE CTIE',
  mission:
    'Optimal management of techno systems in industry using automation, robotics and mechatronics - cost-effective products for a smooth transition to data-driven control.',
  vision: 'To become one of the global leaders in industrial automation solution providers.',
  domains: ['Industrial IoT (IIoT)', 'Automation controllers', 'PLCs', 'Robotics', 'Custom sensor interfaces', 'Industry 4.0 smart factory'],
  services: [
    'Factory automation',
    'Process automation',
    'Data acquisition',
    'Remote monitoring',
    'Production optimization',
  ],
  milestones: [
    { year: '2021', text: 'Founded in Hubballi; joins KLE CTIE TIDE 2.0 (MeitY) program.' },
    { year: '2023', text: 'Master Control Unit launched by Dr. Ekroop Caur (IAS) at Techceleration 2023, Belagavi - KDEM, Govt. of Karnataka.' },
    { year: '2025', text: 'Product demo to MeitY Scientist-D / Joint Director Anurag Kumar via KLE CTIE.' },
    { year: '2026', text: 'PLC-like controller (8 DI / 8 relay, isolated RS485, RTC, Arduino-compatible) + IPC-Mini CNC monitoring in deployment.' },
  ],
}

export const products = [
  {
    id: 'indus-pi',
    name: 'Indusπ',
    tag: 'Flagship IIoT Edge Controller',
    cat: 'Edge',
    path: 'Sensors → Indusπ edge → MQTT → Cloud dashboard → Relay/HMI',
    desc: 'Industry 4.0 field-programmable device. Ingests sensors, user inputs and pre-programmed processes plus multiple DAQ / edge devices concurrently - computes and stores locally, syncs to LAN + cloud, translates device protocols to cloud protocols, and drives HMI displays.',
    specs: ['2× Ethernet', '4 DI / 4 DO', 'WiFi (opt.)', 'MicroSD + HDMI', 'Node-RED', 'Local DB + cloud sync', 'HMI out'],
    badge: 'BEST FOR SMART FACTORY',
    source: 'https://armtronix.net/products/product4',
  },
  {
    id: 'mcu',
    name: 'Master Control Unit',
    tag: 'Multi-device Aggregator',
    cat: 'Edge',
    path: 'DAQ nodes → MCU aggregation → LAN/Cloud → Control commands',
    desc: 'Versatile hub that simultaneously receives data from multiple data-acquisition and edge-control devices, then issues monitoring + control commands back - launched at Techceleration 2023 by Dr. Ekroop Caur (IAS).',
    specs: ['Multi-DAQ ingest', 'Edge command TX', 'LAN + cloud uplink'],
    badge: 'AGGREGATION HUB',
    source: 'https://armtronix.net/',
  },
  {
    id: 'plc-plus',
    name: 'PLC-like Controller (2026)',
    tag: 'New - Arduino-programmable',
    cat: 'Edge',
    path: '8×DI + RS485 sensors → PLC logic → 8×Relay + MQTT/WiFi',
    desc: 'All-new PLC-grade device announced June 2026: galvanically isolated RS485, 8 digital inputs, 8 relay outputs, real-time clock, Arduino-compatible programming, RGB status LED, WiFi + Ethernet.',
    specs: ['8 DI / 8 Relay', 'Isolated RS485', 'RTC', 'WiFi + Ethernet', 'Arduino compatible', 'RGB status'],
    badge: 'NEW · 2026',
    source: 'https://www.linkedin.com/company/armtronix-iot-pvt-ltd',
  },
  {
    id: 'retro-iiot',
    name: 'Retro → IIoT',
    tag: 'Wireless Retrofit',
    cat: 'Retrofit',
    path: 'Legacy machine → Wireless tap → Cloud OEE → Idle alerts',
    desc: 'Developed to remove the re-cabling problem: adds remote monitoring and control to legacy machines over wireless - the fastest brownfield path to Industry 4.0.',
    specs: ['No re-cabling', 'Remote monitor + control', 'CNC-ready'],
    badge: 'BROWNFIELD FIX',
    source: 'https://armtronix.net/',
  },
  {
    id: 'modular-dio',
    name: 'Modular 4 DIO',
    tag: 'I/O Expander',
    cat: 'Expansion',
    path: 'Master device → DIO expansion → +8 programmable points',
    desc: 'Designed for use with Master devices - adds 4 digital inputs & outputs and expands 8 additional programmable I/O points.',
    specs: ['4 DIO', '+8 programmable IO', 'Master-native'],
    badge: 'EXPANSION',
    source: 'https://armtronix.net/',
  },
  {
    id: 'ipc-mini',
    name: 'IPC-Mini',
    tag: 'CNC Machine Monitoring',
    cat: 'Retrofit',
    path: 'CNC tap → IPC-Mini → Shift reports + OEE browser download',
    desc: 'Deployed as a CNC machine-monitoring system (Apr 2026): tracks production per shift, machine idle time, and generates browser-downloadable reports from the desk.',
    specs: ['Idle-time alerts', 'OEE dashboards', 'Shift reports'],
    badge: 'OEE / PRODUCTIVITY',
    source: 'https://www.linkedin.com/company/armtronix-iot-pvt-ltd',
  },
  {
    id: 'improvar',
    name: 'Improvar',
    tag: 'Vision QA Variant',
    cat: 'Expansion',
    path: 'Camera → OpenCV edge → Pass/Fail → Line divert/andon',
    desc: 'Image-Processing Variant system: captures and analyzes visual data to extract information, make decisions, or control downstream systems (OpenCV + Python stack).',
    specs: ['OpenCV vision', 'Inline QA', 'Edge decisions'],
    badge: 'VISION',
    source: 'https://armtronix.net/',
  },
  {
    id: 'presenter',
    name: 'Presenter',
    tag: 'Line Andon Display',
    cat: 'Expansion',
    path: 'Barcode/RFID → Presenter → TV andon + cabin dashboard',
    desc: 'Interacts with barcode scanners, RFID readers and TV/monitor displays - pushes per-line, per-shift product targets and live output/efficiency feedback to operators and the production head’s cabin display.',
    specs: ['Barcode / RFID', 'TV / monitor out', 'Target vs actual'],
    badge: 'ANDON',
    source: 'https://armtronix.net/',
  },
]

export const testimonials = [
  {
    quote:
      'We are highly satisfied with the solutions provided by Armtronix IoT Pvt. Ltd. The Production and efficiency monitoring system, along with the machine idle time monitoring system, have greatly improved our manufacturing processes. Real-time monitoring, operator tracking, and machine idle time insights have enhanced decision-making and productivity.',
    context: 'Production + efficiency monitoring deployment',
  },
  {
    quote:
      'We had a problem with the bending machine resulting in its inefficient utilization. The Armtronix team provided us with a machine monitoring system which was economical as well as Industry 4.0 based. This solution has helped our production team to utilize the machine efficiently - tracking total production per shift and machine idle time, generating reports from the browser.',
    context: 'Bending-machine utilization case',
  },
  {
    quote:
      'Our ask was a solution that shows on a TV on each line the product to be manufactured per shift and the total quantity - with feedback to line members on produced quantity and line efficiency - plus a big display in our production head’s cabin showing what is happening on each line.',
    context: 'Multi-line andon-display requirement (Presenter)',
  },
]

export const telemetryChannels = [
  { id: 'temp', label: 'Spindle Temp', unit: '°C', base: 62, jitter: 4, min: 40, max: 95 },
  { id: 'vib', label: 'Vibration', unit: 'mm/s', base: 2.4, jitter: 0.9, min: 0, max: 7 },
  { id: 'power', label: 'Power Draw', unit: 'kW', base: 7.8, jitter: 1.2, min: 2, max: 15 },
  { id: 'oee', label: 'OEE', unit: '%', base: 78, jitter: 3, min: 40, max: 99 },
]

export const stack = [
  { layer: 'SENSE', items: 'Temp / vibration / current sensors, CNC taps, barcode / RFID, DIO' },
  { layer: 'EDGE', items: 'Indusπ + MCU + PLC-like - Node-RED, local DB, RTC, Arduino-compatible' },
  { layer: 'TRANSPORT', items: 'Isolated RS485 / WiFi / Ethernet (2× on Indusπ), MQTT, protocol translation' },
  { layer: 'CLOUD', items: 'Real-time dashboards, idle-time alerts, historical + shift reports, browser download' },
  { layer: 'ACT', items: 'Relay outputs, HMI / TV andon displays, operator tracking, closed-loop control' },
]
