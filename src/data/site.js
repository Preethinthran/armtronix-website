// ARMTRONIX - site data. Positioning claims only; telemetry figures are
// explicitly illustrative demo values (labeled SIMULATION in UI).

export const nav = [
  { href: '#hardware', label: 'Hardware' },
  { href: '#intelligence', label: 'Intelligence' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#technology', label: 'Technology' },
  { href: '#applications', label: 'Applications' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export const hotspots = [
  { id: 'mcu', n: '01', name: 'MCU', title: 'Microcontroller unit', desc: 'The decision point. Runs control logic, filters sensor input and drives outputs deterministically.' },
  { id: 'sensor', n: '02', name: 'Sensor input', title: 'Sensor input stage', desc: 'Temperature, pressure, vibration and current enter through conditioned analog and digital inputs.' },
  { id: 'io', n: '03', name: 'Digital output', title: 'Digital output stage', desc: 'Relay and logic outputs actuate fans, pumps, motors and alert lines.' },
  { id: 'comm', n: '04', name: 'Communication', title: 'Communication stage', desc: 'Ethernet and RS485 carry telemetry to gateways and bring commands back to the edge.' },
  { id: 'power', n: '05', name: 'Power', title: 'Power management', desc: 'Regulated rails and protection keep the controller alive through industrial power conditions.' },
]

/* Signal journey stages: each has a distinct visual treatment. */
export const journey = [
  { id: 'sensor', name: 'Sensor', desc: 'Physical quantities become electrical signals at the machine.' },
  { id: 'controller', name: 'Controller', desc: 'The edge controller conditions, filters and decides in milliseconds.' },
  { id: 'gateway', name: 'Gateway', desc: 'Buffered telemetry travels over Ethernet and RS485 to the network.' },
  { id: 'cloud', name: 'Cloud', desc: 'Streams land in a continuous, timestamped data record.' },
  { id: 'analytics', name: 'Analytics', desc: 'Thresholds, trends and efficiency emerge from the stream.' },
  { id: 'automation', name: 'Automation', desc: 'Decisions return as physical action - fans, pumps, motors, alerts.' },
]

/* Illustrative demo telemetry - brief §11 values, labeled simulation in UI. */
export const telemetry = [
  { id: 'temp', label: 'Temperature', unit: '°C', base: 72.4, jitter: 1.6, min: 60, max: 90, decimals: 1 },
  { id: 'pressure', label: 'Pressure', unit: 'bar', base: 4.82, jitter: 0.22, min: 3.5, max: 6.5, decimals: 2 },
  { id: 'vib', label: 'Vibration', unit: 'mm/s', base: 2.4, jitter: 0.7, min: 0.4, max: 6, decimals: 1 },
  { id: 'current', label: 'Current', unit: 'A', base: 18.7, jitter: 1.4, min: 12, max: 26, decimals: 1 },
  { id: 'eff', label: 'Efficiency', unit: '%', base: 94.2, jitter: 0.8, min: 88, max: 99, decimals: 1 },
  { id: 'uptime', label: 'Uptime', unit: '%', base: 98.2, jitter: 0.2, min: 96, max: 100, decimals: 1 },
]

export const technologies = [
  {
    id: 'iiot', name: 'Industrial IoT',
    desc: 'Sensor-to-cloud pipelines that make machines addressable: every signal timestamped, buffered and traceable from the physical point to the dashboard.',
    points: ['Conditioned sensor inputs', 'Edge buffering + store-and-forward', 'Timestamped telemetry streams'],
  },
  {
    id: 'controllers', name: 'Automation Controllers',
    desc: 'Deterministic control hardware that reads inputs, executes logic and drives outputs - the reliable middle between sensor and action.',
    points: ['Digital + analog I/O', 'Relay and logic outputs', 'Local decision loops'],
  },
  {
    id: 'robotics', name: 'Robotics',
    desc: 'Motion and manipulation tied into the same signal fabric - robots that report state and accept supervisory control.',
    points: ['Motion supervision', 'State reporting', 'Safety interlocks'],
  },
  {
    id: 'sensors', name: 'Sensor Interfaces',
    desc: 'Custom front-ends for temperature, pressure, vibration, current and beyond - built for the electrical reality of the plant floor.',
    points: ['Temperature / pressure / vibration', 'Current sensing', 'Industrial signal conditioning'],
  },
  {
    id: 'plc', name: 'PLCs',
    desc: 'Programmable logic control for sequencing, interlocking and safety - engineered for continuous duty in harsh environments.',
    points: ['Ladder-style sequencing', 'Interlocks + alarms', 'Continuous-duty design'],
  },
  {
    id: 'i40', name: 'Industry 4.0',
    desc: 'The whole stack composed: connected equipment, live telemetry, analytics and closed-loop automation across the facility.',
    points: ['Connected equipment', 'Live OEE-style visibility', 'Closed-loop optimization'],
  },
]

export const applications = [
  { id: 'factory', name: 'Smart Factory', desc: 'Cell-level visibility and control across production lines.', metric: ['94.2 %', 'line efficiency'] },
  { id: 'monitoring', name: 'Machine Monitoring', desc: 'Vibration, temperature and current watched continuously.', metric: ['2.4 mm/s', 'vibration baseline'] },
  { id: 'process', name: 'Process Automation', desc: 'Sequenced control of multi-step industrial processes.', metric: ['18.7 A', 'process load'] },
  { id: 'energy', name: 'Energy Monitoring', desc: 'Load profiles that expose waste and peak demand.', metric: ['124.6 kW', 'total demand'] },
  { id: 'predictive', name: 'Predictive Maintenance', desc: 'Drift and anomaly signatures caught before failure.', metric: ['72.4 °C', 'bearing temp'] },
  { id: 'robotics-app', name: 'Robotics', desc: 'Supervised motion cells reporting state in real time.', metric: ['98.2 %', 'cell uptime'] },
  { id: 'control', name: 'Industrial Control', desc: 'Deterministic loops for interlocks, alarms and safety.', metric: ['<10 ms', 'edge decision'] },
  { id: 'equipment', name: 'Connected Equipment', desc: 'Legacy machines retrofitted with sensing and uplink.', metric: ['24/7', 'telemetry stream'] },
]

export const whyRows = [
  { statement: 'Hardware first', desc: 'Intelligence begins at reliable physical interfaces - controllers, sensors and machines - not in a slide deck.' },
  { statement: 'Connected by design', desc: 'Every layer speaks the same signal language, from RS485 on the floor to the cloud record.' },
  { statement: 'Engineered for industry', desc: 'Built for electrical noise, heat, vibration and continuous duty - not the lab bench.' },
  { statement: 'Data into action', desc: 'Telemetry closes the loop: thresholds trigger controllers that move real actuators.' },
  { statement: 'Built for scale', desc: 'From one monitored machine to facility-wide automation on the same architecture.' },
]

export const enquiryTracks = [
  'Machine monitoring',
  'Factory automation',
  'IIoT',
  'Robotics',
  'Custom controller',
  'Other',
]
