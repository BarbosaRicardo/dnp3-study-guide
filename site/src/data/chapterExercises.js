// DNP3 Chapter Exercises — one per chapter
// Each exercise targets the coding concept most relevant to that chapter

export const DNP3_CHAPTER_EXERCISES = {

  intro: {
    id: 'dnp3-ch1-ex',
    title: 'DNP3 vs Modbus Feature Comparison',
    scenario: `You're building a protocol selector utility for a SCADA design tool.
Given a list of required features, return which protocols support ALL of them.

Protocols and their supported features:
  'modbus':  ['polling', 'coils', 'registers', 'tcp', 'serial']
  'dnp3':    ['polling', 'events', 'timestamps', 'quality-flags', 'unsolicited', 'tcp', 'serial', 'security']
  'iec61850':['events', 'timestamps', 'goose', 'mms', 'tcp', 'security']

Implement protocolsSupporting(features) → string[] of protocol names that support ALL listed features.

Examples:
  protocolsSupporting(['events', 'timestamps']) → ['dnp3', 'iec61850']
  protocolsSupporting(['polling', 'serial'])    → ['modbus', 'dnp3']
  protocolsSupporting(['unsolicited'])           → ['dnp3']`,
    hint: 'Build a map of protocol → feature Set. Filter protocols where every required feature is in the set.',
    starter: `const PROTOCOLS = {
  modbus:   new Set(['polling', 'coils', 'registers', 'tcp', 'serial']),
  dnp3:     new Set(['polling', 'events', 'timestamps', 'quality-flags', 'unsolicited', 'tcp', 'serial', 'security']),
  iec61850: new Set(['events', 'timestamps', 'goose', 'mms', 'tcp', 'security']),
}

function protocolsSupporting(features) {
  // TODO: filter protocol entries where every feature in the input array
  //       is present in that protocol's Set
  return []
}

const solution = protocolsSupporting

console.log(protocolsSupporting(['events', 'timestamps']))
console.log(protocolsSupporting(['polling', 'serial']))
console.log(protocolsSupporting(['unsolicited']))
console.log(protocolsSupporting(['polling', 'security']))`,
    starterPy: `PROTOCOLS = {
    'modbus':   {'polling', 'coils', 'registers', 'tcp', 'serial'},
    'dnp3':     {'polling', 'events', 'timestamps', 'quality-flags', 'unsolicited', 'tcp', 'serial', 'security'},
    'iec61850': {'events', 'timestamps', 'goose', 'mms', 'tcp', 'security'},
}

def protocols_supporting(features):
    # TODO: return list of protocol names where all features are in the protocol's set
    return []

solution = protocols_supporting

print(protocols_supporting(['events', 'timestamps']))
print(protocols_supporting(['polling', 'serial']))`,
    tests: [
      { description: "['events','timestamps'] → ['dnp3','iec61850']" },
      { description: "['polling','serial'] → ['modbus','dnp3']" },
      { description: "['unsolicited'] → ['dnp3']" },
      { description: "['polling','security'] → ['dnp3']" },
    ],
    testRunner: function(solution) {
      function check(input, validator) {
        try {
          const r = solution(input)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      const same = (a, b) => Array.isArray(a) && a.length === b.length && b.every(x => a.includes(x))
      return [
        check(['events','timestamps'],   r => same(r, ['dnp3','iec61850'])),
        check(['polling','serial'],      r => same(r, ['modbus','dnp3'])),
        check(['unsolicited'],           r => same(r, ['dnp3'])),
        check(['polling','security'],    r => same(r, ['dnp3'])),
      ]
    },
  },

  layers: {
    id: 'dnp3-ch2-ex',
    title: 'DNP3 PDU Layer Classifier',
    scenario: `DNP3 has three layers, each producing a different PDU type. Write a classifier.

Given a raw byte buffer as an array of integers, identify which DNP3 layer it belongs to and return metadata:

Rules:
  • If buffer[0] === 0x05 && buffer[1] === 0x64  → LPDU (Data Link frame)
      Return { layer: 'DataLink', hasCRC: true, maxPayload: 282 }
  • If buffer length === 1 and (buffer[0] & 0xC0) is 0x40 or 0x80 or 0xC0 or 0x00
    (i.e., the byte only has bits 7-6 set as FIR/FIN flags)  → TPDU (Transport segment)
      Return { layer: 'Transport', fir: !!(buffer[0] & 0x40), fin: !!(buffer[0] & 0x80), seq: buffer[0] & 0x3F }
  • Otherwise → APDU (Application Layer message)
      Return { layer: 'Application' }

Implement classifyDNP3PDU(buffer).`,
    hint: 'Check start bytes first for LPDU. Then check if length === 1 for TPDU. Otherwise APDU. Use bitwise & to extract FIR/FIN/seq from the transport byte.',
    starter: `function classifyDNP3PDU(buffer) {
  if (!Array.isArray(buffer) || buffer.length === 0) return null

  // TODO: Check if it starts with 0x05, 0x64 → LPDU
  // TODO: Check if length is 1 → TPDU, extract FIR (bit 6), FIN (bit 7), seq (bits 0-5)
  // TODO: Otherwise → APDU

  return { layer: 'Application' }
}

const solution = classifyDNP3PDU

console.log(classifyDNP3PDU([0x05, 0x64, 0x14, 0x44, 0x05, 0x00, 0x01, 0x00]))
console.log(classifyDNP3PDU([0xC0]))   // FIR=1 FIN=1 seq=0
console.log(classifyDNP3PDU([0x40]))   // FIR=1 FIN=0 seq=0
console.log(classifyDNP3PDU([0xC1, 0x01, 0x3C, 0x01, 0x06]))  // APDU`,
    starterPy: `def classify_dnp3_pdu(buffer):
    if not buffer:
        return None

    # TODO: Check start bytes for LPDU
    # TODO: Length 1 → TPDU: extract FIR (bit 6), FIN (bit 7), seq (bits 0-5)
    # TODO: Otherwise APDU

    return {'layer': 'Application'}

solution = classify_dnp3_pdu

print(classify_dnp3_pdu([0x05, 0x64, 0x14, 0x44, 0x05, 0x00, 0x01, 0x00]))
print(classify_dnp3_pdu([0xC0]))
print(classify_dnp3_pdu([0xC1, 0x01, 0x3C, 0x01, 0x06]))`,
    tests: [
      { description: '[0x05,0x64,...] → layer: DataLink, maxPayload: 282' },
      { description: '[0xC0] (single byte) → layer: Transport, fir:true, fin:true, seq:0' },
      { description: '[0x40] → layer: Transport, fir:true, fin:false, seq:0' },
      { description: '[0xC1,0x01,...] → layer: Application' },
    ],
    testRunner: function(solution) {
      function check(input, validator) {
        try {
          const r = solution(input)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check([0x05,0x64,0x14,0x44,0x05,0x00,0x01,0x00], r => r && r.layer === 'DataLink' && r.maxPayload === 282),
        check([0xC0],  r => r && r.layer === 'Transport' && r.fir === true && r.fin === true && r.seq === 0),
        check([0x40],  r => r && r.layer === 'Transport' && r.fir === true && r.fin === false),
        check([0xC1,0x01,0x3C,0x01,0x06], r => r && r.layer === 'Application'),
      ]
    },
  },

  datalink: {
    id: 'dnp3-ch3-ex',
    title: 'DNP3 CRC-16 Calculator',
    scenario: `Every DNP3 Data Link data block is protected by a CRC-16/DNP checksum.
Implement the CRC-16/DNP algorithm and use it to validate a data block.

The CRC-16/DNP polynomial is 0x3D65 (reflected: process LSB first).
Initial value: 0xFFFF. Final XOR: 0xFFFF.

Implement:
  1. crc16dnp(bytes)  → integer CRC value
  2. validateBlock(dataBytes, crcLow, crcHigh) → true if CRC matches

The CRC is appended LSB first: low byte, then high byte.

Known test vector — DNP3 header first 8 bytes [0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00]
  Expected CRC of those 8 bytes: 0x2D84 (low=0x84, high=0x2D)`,
    hint: 'Use the reflected CRC algorithm: for each byte, XOR into CRC, then for 8 bits: if LSB set, shift right and XOR with 0xA6BC (reflected polynomial); else just shift right. Final XOR with 0xFFFF.',
    starter: `function crc16dnp(bytes) {
  let crc = 0xFFFF
  const POLY = 0xA6BC  // reflected 0x3D65

  for (const byte of bytes) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc = (crc >>> 1) ^ POLY
      } else {
        crc >>>= 1
      }
    }
  }
  return crc ^ 0xFFFF
}

function validateBlock(dataBytes, crcLow, crcHigh) {
  // TODO: compute crc16dnp(dataBytes), compare to (crcHigh << 8) | crcLow
  return false
}

const solution = validateBlock

// Test: header bytes [0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00] → CRC 0x2D84
const headerBytes = [0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00]
console.log('CRC hex:', '0x' + crc16dnp(headerBytes).toString(16).toUpperCase())
console.log('Validate good:', validateBlock(headerBytes, 0x84, 0x2D))
console.log('Validate bad: ', validateBlock(headerBytes, 0x00, 0x00))`,
    starterPy: `def crc16dnp(data):
    crc = 0xFFFF
    POLY = 0xA6BC  # reflected 0x3D65
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 0x0001:
                crc = (crc >> 1) ^ POLY
            else:
                crc >>= 1
    return crc ^ 0xFFFF

def validate_block(data_bytes, crc_low, crc_high):
    # TODO: compute crc16dnp(data_bytes) and compare to (crc_high << 8) | crc_low
    return False

solution = validate_block

header = [0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00]
print("CRC:", hex(crc16dnp(header)))
print("Valid:", validate_block(header, 0x84, 0x2D))
print("Bad:  ", validate_block(header, 0x00, 0x00))`,
    tests: [
      { description: 'crc16dnp([0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00]) === 0x2D84' },
      { description: 'validateBlock(headerBytes, 0x84, 0x2D) → true' },
      { description: 'validateBlock(headerBytes, 0x00, 0x00) → false' },
      { description: 'crc16dnp([]) returns a number (empty input handled)' },
    ],
    testRunner: function(solution) {
      function crc16dnp(bytes) {
        let crc = 0xFFFF
        const POLY = 0xA6BC
        for (const byte of bytes) {
          crc ^= byte
          for (let i = 0; i < 8; i++) {
            if (crc & 0x0001) crc = (crc >>> 1) ^ POLY
            else crc >>>= 1
          }
        }
        return crc ^ 0xFFFF
      }
      const header = [0x05,0x64,0x05,0x00,0x03,0x00,0x04,0x00]
      function check(input, validator) {
        try {
          const r = solution(...(Array.isArray(input) ? input : [input]))
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        (() => { try { const r = crc16dnp(header); return { passed: r === 0x2D84, expected: '0x2D84', actual: '0x' + r.toString(16).toUpperCase() } } catch(e) { return { passed: false, error: e.message } } })(),
        check([header, 0x84, 0x2D], r => r === true),
        check([header, 0x00, 0x00], r => r === false),
        (() => { try { const r = crc16dnp([]); return { passed: typeof r === 'number', expected: 'a number', actual: typeof r } } catch(e) { return { passed: false, error: e.message } } })(),
      ]
    },
  },

  appLayer: {
    id: 'dnp3-ch4-ex',
    title: 'DNP3 IIN Bits Decoder',
    scenario: `Every DNP3 response contains two IIN (Internal Indication) bytes.
Implement decodeIIN(iin1, iin2) that returns an array of active flag names.

IIN1 bit mapping (bit 0 = LSB):
  bit 0 → 'BROADCAST'
  bit 1 → 'CLASS_1_EVENTS'
  bit 2 → 'CLASS_2_EVENTS'
  bit 3 → 'CLASS_3_EVENTS'
  bit 4 → 'NEED_TIME'
  bit 5 → 'LOCAL_CONTROL'
  bit 6 → 'DEVICE_TROUBLE'
  bit 7 → 'DEVICE_RESTART'

IIN2 bit mapping:
  bit 0 → 'NO_FUNC_CODE_SUPPORT'
  bit 1 → 'OBJECT_UNKNOWN'
  bit 2 → 'PARAMETER_ERROR'
  bit 3 → 'EVENT_BUFFER_OVERFLOW'
  bit 4 → 'ALREADY_EXECUTING'
  bit 5 → 'CONFIG_CORRUPT'
  bit 6 → 'RESERVED_2_6'
  bit 7 → 'RESERVED_2_7'

Return only flags where the bit is SET (1).

Example:
  decodeIIN(0x40, 0x08) → ['DEVICE_TROUBLE', 'EVENT_BUFFER_OVERFLOW']`,
    hint: 'For each byte, iterate bits 0-7. Use (byte >> bit) & 1 to check if set. Build the flag name from the lookup array.',
    starter: `const IIN1_FLAGS = [
  'BROADCAST', 'CLASS_1_EVENTS', 'CLASS_2_EVENTS', 'CLASS_3_EVENTS',
  'NEED_TIME', 'LOCAL_CONTROL', 'DEVICE_TROUBLE', 'DEVICE_RESTART'
]
const IIN2_FLAGS = [
  'NO_FUNC_CODE_SUPPORT', 'OBJECT_UNKNOWN', 'PARAMETER_ERROR', 'EVENT_BUFFER_OVERFLOW',
  'ALREADY_EXECUTING', 'CONFIG_CORRUPT', 'RESERVED_2_6', 'RESERVED_2_7'
]

function decodeIIN(iin1, iin2) {
  const active = []
  // TODO: for bit 0..7: if (iin1 >> bit) & 1, push IIN1_FLAGS[bit]
  // TODO: for bit 0..7: if (iin2 >> bit) & 1, push IIN2_FLAGS[bit]
  return active
}

const solution = decodeIIN

console.log(decodeIIN(0x40, 0x08))   // ['DEVICE_TROUBLE', 'EVENT_BUFFER_OVERFLOW']
console.log(decodeIIN(0x80, 0x00))   // ['DEVICE_RESTART']
console.log(decodeIIN(0x00, 0x00))   // []
console.log(decodeIIN(0x10, 0x02))   // ['NEED_TIME', 'OBJECT_UNKNOWN']`,
    starterPy: `IIN1_FLAGS = [
    'BROADCAST', 'CLASS_1_EVENTS', 'CLASS_2_EVENTS', 'CLASS_3_EVENTS',
    'NEED_TIME', 'LOCAL_CONTROL', 'DEVICE_TROUBLE', 'DEVICE_RESTART'
]
IIN2_FLAGS = [
    'NO_FUNC_CODE_SUPPORT', 'OBJECT_UNKNOWN', 'PARAMETER_ERROR', 'EVENT_BUFFER_OVERFLOW',
    'ALREADY_EXECUTING', 'CONFIG_CORRUPT', 'RESERVED_2_6', 'RESERVED_2_7'
]

def decode_iin(iin1, iin2):
    active = []
    # TODO: for bit in range(8): if (iin1 >> bit) & 1: active.append(IIN1_FLAGS[bit])
    # TODO: same for iin2 / IIN2_FLAGS
    return active

solution = decode_iin

print(decode_iin(0x40, 0x08))
print(decode_iin(0x80, 0x00))
print(decode_iin(0x00, 0x00))`,
    tests: [
      { description: 'decodeIIN(0x40, 0x08) → [DEVICE_TROUBLE, EVENT_BUFFER_OVERFLOW]' },
      { description: 'decodeIIN(0x80, 0x00) → [DEVICE_RESTART]' },
      { description: 'decodeIIN(0x00, 0x00) → [] (no flags)' },
      { description: 'decodeIIN(0x10, 0x02) → [NEED_TIME, OBJECT_UNKNOWN]' },
    ],
    testRunner: function(solution) {
      function check(a, b, validator) {
        try {
          const r = solution(a, b)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      const has = (r, ...flags) => Array.isArray(r) && flags.every(f => r.includes(f)) && r.length === flags.length
      return [
        check(0x40, 0x08, r => has(r, 'DEVICE_TROUBLE', 'EVENT_BUFFER_OVERFLOW')),
        check(0x80, 0x00, r => has(r, 'DEVICE_RESTART')),
        check(0x00, 0x00, r => Array.isArray(r) && r.length === 0),
        check(0x10, 0x02, r => has(r, 'NEED_TIME', 'OBJECT_UNKNOWN')),
      ]
    },
  },

  objects: {
    id: 'dnp3-ch5-ex',
    title: 'DNP3 Data Object Quality Flag Parser',
    scenario: `DNP3 data objects include a quality byte with bit flags indicating the reliability of the value.
Implement parseQuality(qualityByte) that returns an object describing the point's status.

Binary Input quality byte bit mapping (bit 0 = LSB):
  bit 0 → online       (1 = data is valid and current)
  bit 1 → restart      (1 = device restarted, value may be stale)
  bit 2 → commLost     (1 = lost comms with sub-device)
  bit 3 → remoteForced (1 = value forced from SCADA)
  bit 4 → localForced  (1 = value forced locally at the device)
  bit 5 → chatterFilter (1 = rapid state changes suppressed)
  bits 6-7 → state bits (for binary: bit 6 = point state, 0=OFF 1=ON)

Return: { online, restart, commLost, remoteForced, localForced, chatterFilter, state }
where state is 0 or 1 (the binary value from bit 6).

Examples:
  parseQuality(0x01) → { online:true, restart:false, commLost:false, ..., state:0 }
  parseQuality(0x41) → { online:true, ..., state:1 }   (bit 6 set = ON)
  parseQuality(0x06) → { online:false, restart:true, commLost:true, ..., state:0 }`,
    hint: 'Use bitwise AND to extract each bit: (byte >> bitPos) & 1. State comes from bit 6: (byte >> 6) & 1.',
    starter: `function parseQuality(qualityByte) {
  // TODO: extract each flag bit using (qualityByte >> bitPos) & 1
  // Return an object with: online, restart, commLost, remoteForced, localForced, chatterFilter, state
  return {
    online:        false,
    restart:       false,
    commLost:      false,
    remoteForced:  false,
    localForced:   false,
    chatterFilter: false,
    state:         0,
  }
}

const solution = parseQuality

console.log(parseQuality(0x01))  // online=true, state=0
console.log(parseQuality(0x41))  // online=true, state=1 (bit6 set)
console.log(parseQuality(0x06))  // restart=true, commLost=true`,
    starterPy: `def parse_quality(quality_byte):
    # TODO: extract flags from quality byte
    return {
        'online':        False,
        'restart':       False,
        'comm_lost':     False,
        'remote_forced': False,
        'local_forced':  False,
        'chatter_filter':False,
        'state':         0,
    }

solution = parse_quality

print(parse_quality(0x01))
print(parse_quality(0x41))
print(parse_quality(0x06))`,
    tests: [
      { description: 'parseQuality(0x01) → online:true, restart:false, state:0' },
      { description: 'parseQuality(0x41) → online:true, state:1 (bit 6 set)' },
      { description: 'parseQuality(0x06) → online:false, restart:true, commLost:true' },
      { description: 'parseQuality(0x00) → all false, state:0 (point offline)' },
    ],
    testRunner: function(solution) {
      function check(byte, validator) {
        try {
          const r = solution(byte)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check(0x01, r => r.online === true && r.restart === false && r.state === 0),
        check(0x41, r => r.online === true && r.state === 1),
        check(0x06, r => r.online === false && r.restart === true && (r.commLost === true || r.comm_lost === true)),
        check(0x00, r => r.online === false && r.state === 0),
      ]
    },
  },

  fc: {
    id: 'dnp3-ch6-ex',
    title: 'DNP3 Function Code Lookup',
    scenario: `Build a DNP3 function code registry that validates and describes function codes.

Implement fcInfo(code) → { name, direction, requiresSBO } or null for unknown codes.

Function codes to implement:
  0x00 → { name: 'CONFIRM',           direction: 'master→outstation', requiresSBO: false }
  0x01 → { name: 'READ',              direction: 'master→outstation', requiresSBO: false }
  0x02 → { name: 'WRITE',             direction: 'master→outstation', requiresSBO: false }
  0x03 → { name: 'SELECT',            direction: 'master→outstation', requiresSBO: true  }
  0x04 → { name: 'OPERATE',           direction: 'master→outstation', requiresSBO: true  }
  0x05 → { name: 'DIRECT_OPERATE',    direction: 'master→outstation', requiresSBO: false }
  0x0D → { name: 'COLD_RESTART',      direction: 'master→outstation', requiresSBO: false }
  0x0E → { name: 'WARM_RESTART',      direction: 'master→outstation', requiresSBO: false }
  0x14 → { name: 'ENABLE_UNSOLICITED',direction: 'master→outstation', requiresSBO: false }
  0x15 → { name: 'DISABLE_UNSOLICITED',direction:'master→outstation', requiresSBO: false }
  0x81 → { name: 'RESPONSE',          direction: 'outstation→master', requiresSBO: false }
  0x82 → { name: 'UNSOLICITED_RESPONSE', direction: 'outstation→master', requiresSBO: false }

Return null for any code not in the list.`,
    hint: 'Build a plain object keyed by the numeric code. Convert input to number if needed. Return null on miss.',
    starter: `const FC_MAP = {
  0x00: { name: 'CONFIRM',            direction: 'master→outstation', requiresSBO: false },
  0x01: { name: 'READ',               direction: 'master→outstation', requiresSBO: false },
  0x02: { name: 'WRITE',              direction: 'master→outstation', requiresSBO: false },
  0x03: { name: 'SELECT',             direction: 'master→outstation', requiresSBO: true  },
  0x04: { name: 'OPERATE',            direction: 'master→outstation', requiresSBO: true  },
  0x05: { name: 'DIRECT_OPERATE',     direction: 'master→outstation', requiresSBO: false },
  0x0D: { name: 'COLD_RESTART',       direction: 'master→outstation', requiresSBO: false },
  0x0E: { name: 'WARM_RESTART',       direction: 'master→outstation', requiresSBO: false },
  0x14: { name: 'ENABLE_UNSOLICITED', direction: 'master→outstation', requiresSBO: false },
  0x15: { name: 'DISABLE_UNSOLICITED',direction: 'master→outstation', requiresSBO: false },
  0x81: { name: 'RESPONSE',           direction: 'outstation→master', requiresSBO: false },
  0x82: { name: 'UNSOLICITED_RESPONSE',direction:'outstation→master', requiresSBO: false },
}

function fcInfo(code) {
  // TODO: look up code in FC_MAP, return the entry or null
  return null
}

const solution = fcInfo

console.log(fcInfo(0x01))   // READ
console.log(fcInfo(0x03))   // SELECT — requiresSBO: true
console.log(fcInfo(0x81))   // RESPONSE from outstation
console.log(fcInfo(0xFF))   // null — unknown`,
    starterPy: `FC_MAP = {
    0x00: {'name': 'CONFIRM',             'direction': 'master→outstation', 'requires_sbo': False},
    0x01: {'name': 'READ',                'direction': 'master→outstation', 'requires_sbo': False},
    0x02: {'name': 'WRITE',               'direction': 'master→outstation', 'requires_sbo': False},
    0x03: {'name': 'SELECT',              'direction': 'master→outstation', 'requires_sbo': True},
    0x04: {'name': 'OPERATE',             'direction': 'master→outstation', 'requires_sbo': True},
    0x05: {'name': 'DIRECT_OPERATE',      'direction': 'master→outstation', 'requires_sbo': False},
    0x0D: {'name': 'COLD_RESTART',        'direction': 'master→outstation', 'requires_sbo': False},
    0x14: {'name': 'ENABLE_UNSOLICITED',  'direction': 'master→outstation', 'requires_sbo': False},
    0x81: {'name': 'RESPONSE',            'direction': 'outstation→master', 'requires_sbo': False},
    0x82: {'name': 'UNSOLICITED_RESPONSE','direction': 'outstation→master', 'requires_sbo': False},
}

def fc_info(code):
    # TODO: return FC_MAP.get(code) or None
    return None

solution = fc_info

print(fc_info(0x01))
print(fc_info(0x03))
print(fc_info(0xFF))`,
    tests: [
      { description: 'fcInfo(0x01) → name: READ, direction: master→outstation' },
      { description: 'fcInfo(0x03) → name: SELECT, requiresSBO: true' },
      { description: 'fcInfo(0x81) → direction: outstation→master' },
      { description: 'fcInfo(0xFF) → null (unknown FC)' },
    ],
    testRunner: function(solution) {
      function check(code, validator) {
        try {
          const r = solution(code)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check(0x01, r => r && r.name === 'READ' && r.direction === 'master→outstation'),
        check(0x03, r => r && r.name === 'SELECT' && (r.requiresSBO === true || r.requires_sbo === true)),
        check(0x81, r => r && (r.direction === 'outstation→master')),
        check(0xFF, r => r === null),
      ]
    },
  },

  unsol: {
    id: 'dnp3-ch7-ex',
    title: 'Unsolicited Response Retry Scheduler',
    scenario: `An outstation must manage retransmission of unconfirmed unsolicited messages.
Implement a retry scheduler that determines whether to retransmit, and when.

Implement shouldRetry(attempts, maxRetries, lastSentMs, retryDelayMs, nowMs):
  • attempts: number of times sent so far (starts at 1 after first send)
  • maxRetries: maximum number of retransmissions allowed
  • lastSentMs: timestamp of last send in milliseconds
  • retryDelayMs: minimum milliseconds between retries
  • nowMs: current time in milliseconds

Return: { retry: boolean, waitMs: number }
  - If attempts >= maxRetries → { retry: false, waitMs: 0 }
  - If (nowMs - lastSentMs) < retryDelayMs → { retry: false, waitMs: retryDelayMs - (nowMs - lastSentMs) }
  - Otherwise → { retry: true, waitMs: 0 }

Examples:
  shouldRetry(1, 3, 1000, 5000, 4000)  → { retry:false, waitMs:2000 }  // too soon
  shouldRetry(1, 3, 1000, 5000, 6500)  → { retry:true,  waitMs:0 }     // ready
  shouldRetry(3, 3, 1000, 5000, 9000)  → { retry:false, waitMs:0 }     // max reached`,
    hint: 'Check maxRetries condition first. Then calculate elapsed = nowMs - lastSentMs. If elapsed < retryDelayMs, return waitMs = retryDelayMs - elapsed.',
    starter: `function shouldRetry(attempts, maxRetries, lastSentMs, retryDelayMs, nowMs) {
  // TODO: if attempts >= maxRetries → no retry
  // TODO: calculate elapsed = nowMs - lastSentMs
  // TODO: if elapsed < retryDelayMs → not yet, return waitMs
  // TODO: otherwise → retry now
  return { retry: false, waitMs: 0 }
}

const solution = shouldRetry

console.log(shouldRetry(1, 3, 1000, 5000, 4000))  // too soon
console.log(shouldRetry(1, 3, 1000, 5000, 6500))  // ready
console.log(shouldRetry(3, 3, 1000, 5000, 9000))  // max reached`,
    starterPy: `def should_retry(attempts, max_retries, last_sent_ms, retry_delay_ms, now_ms):
    # TODO: if attempts >= max_retries → no retry
    # TODO: elapsed = now_ms - last_sent_ms
    # TODO: if elapsed < retry_delay_ms → not ready, return wait_ms
    # TODO: otherwise retry
    return {'retry': False, 'wait_ms': 0}

solution = should_retry

print(should_retry(1, 3, 1000, 5000, 4000))
print(should_retry(1, 3, 1000, 5000, 6500))
print(should_retry(3, 3, 1000, 5000, 9000))`,
    tests: [
      { description: 'attempts=1/max=3, elapsed=3s, delay=5s → retry:false, waitMs:2000' },
      { description: 'attempts=1/max=3, elapsed=5.5s, delay=5s → retry:true, waitMs:0' },
      { description: 'attempts=3/max=3 → retry:false, waitMs:0 (max reached)' },
      { description: 'attempts=0/max=3, elapsed=10s → retry:true (first attempt ready)' },
    ],
    testRunner: function(solution) {
      function check(args, validator) {
        try {
          const r = solution(...args)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      const waitMs = r => r.waitMs !== undefined ? r.waitMs : r.wait_ms
      const retry  = r => r.retry !== undefined ? r.retry : r.retry
      return [
        check([1,3,1000,5000,4000], r => retry(r)===false && waitMs(r)===2000),
        check([1,3,1000,5000,6500], r => retry(r)===true  && waitMs(r)===0),
        check([3,3,1000,5000,9000], r => retry(r)===false && waitMs(r)===0),
        check([0,3,1000,5000,6500], r => retry(r)===true),
      ]
    },
  },

  security: {
    id: 'dnp3-ch8-ex',
    title: 'DNP3 SA Critical Message Classifier',
    scenario: `DNP3 Secure Authentication only challenges "critical" function codes — those that DO something dangerous.
Read-only operations are not challenged (that would kill network performance).

Implement isCriticalFC(fc) → boolean

Critical function codes (require SA challenge):
  0x03 SELECT, 0x04 OPERATE, 0x05 DIRECT_OPERATE, 0x06 DIRECT_OPERATE_NO_ACK,
  0x0D COLD_RESTART, 0x0E WARM_RESTART, 0x0F INITIALIZE_DATA,
  0x10 INITIALIZE_APPLICATION, 0x11 START_APPLICATION, 0x12 STOP_APPLICATION,
  0x14 ENABLE_UNSOLICITED, 0x15 DISABLE_UNSOLICITED, 0x16 ASSIGN_CLASS,
  0x18 FREEZE_AT_TIME, 0x1A FREEZE_CLEAR_NO_ACK

Non-critical (NOT challenged): 0x00 CONFIRM, 0x01 READ, 0x02 WRITE, 0x81 RESPONSE, 0x82 UNSOLICITED_RESPONSE

Also implement: summarizeAuthDecision(fc) → { fc, name, challenged, reason }`,
    hint: 'Build a Set of critical FC values. isCriticalFC = CRITICAL_FCS.has(fc). For the summary, build a name lookup map too.',
    starter: `const CRITICAL_FCS = new Set([
  0x03, 0x04, 0x05, 0x06,   // SELECT, OPERATE, DIRECT_OPERATE variants
  0x0D, 0x0E, 0x0F,         // COLD/WARM_RESTART, INITIALIZE_DATA
  0x10, 0x11, 0x12,         // application control
  0x14, 0x15, 0x16,         // unsolicited control, class assign
  0x18, 0x1A                // freeze variants
])

const FC_NAMES = {
  0x01: 'READ', 0x02: 'WRITE', 0x03: 'SELECT', 0x04: 'OPERATE',
  0x05: 'DIRECT_OPERATE', 0x0D: 'COLD_RESTART', 0x0E: 'WARM_RESTART',
  0x14: 'ENABLE_UNSOLICITED', 0x15: 'DISABLE_UNSOLICITED',
  0x81: 'RESPONSE', 0x82: 'UNSOLICITED_RESPONSE',
}

function isCriticalFC(fc) {
  // TODO: return true if fc is in CRITICAL_FCS
  return false
}

function summarizeAuthDecision(fc) {
  // TODO: return { fc, name, challenged, reason }
  // reason: 'Control/configuration command' if critical, 'Read-only or response' otherwise
  return null
}

const solution = summarizeAuthDecision

console.log(isCriticalFC(0x04))   // true (OPERATE)
console.log(isCriticalFC(0x01))   // false (READ)
console.log(summarizeAuthDecision(0x04))
console.log(summarizeAuthDecision(0x01))`,
    starterPy: `CRITICAL_FCS = {0x03, 0x04, 0x05, 0x06, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12, 0x14, 0x15, 0x16, 0x18, 0x1A}

FC_NAMES = {
    0x01: 'READ', 0x02: 'WRITE', 0x03: 'SELECT', 0x04: 'OPERATE',
    0x05: 'DIRECT_OPERATE', 0x0D: 'COLD_RESTART', 0x14: 'ENABLE_UNSOLICITED',
    0x81: 'RESPONSE', 0x82: 'UNSOLICITED_RESPONSE',
}

def is_critical_fc(fc):
    # TODO: return True if fc in CRITICAL_FCS
    return False

def summarize_auth_decision(fc):
    # TODO: return dict with fc, name, challenged, reason
    return None

solution = summarize_auth_decision

print(is_critical_fc(0x04))
print(is_critical_fc(0x01))
print(summarize_auth_decision(0x04))`,
    tests: [
      { description: 'isCriticalFC(0x04) → true (OPERATE is critical)' },
      { description: 'isCriticalFC(0x01) → false (READ is not challenged)' },
      { description: 'summarizeAuthDecision(0x04) → challenged:true, name:OPERATE' },
      { description: 'summarizeAuthDecision(0x01) → challenged:false, name:READ' },
    ],
    testRunner: function(solution) {
      const CRITICAL = new Set([0x03,0x04,0x05,0x06,0x0D,0x0E,0x0F,0x10,0x11,0x12,0x14,0x15,0x16,0x18,0x1A])
      function check(fc, validator) {
        try {
          const r = solution(fc)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        (() => { try { const fn = solution.__isCritical || (fc => CRITICAL.has(fc)); return { passed: CRITICAL.has(0x04), expected: 'true', actual: 'true' } } catch(e) { return { passed: false, error: e.message } } })(),
        check(0x04, r => r && (r.challenged === true) && (r.name === 'OPERATE' || r.fc === 0x04)),
        check(0x01, r => r && (r.challenged === false)),
        check(0x0D, r => r && (r.challenged === true)),
      ]
    },
  },

  troubleshoot: {
    id: 'dnp3-ch9-ex',
    title: 'DNP3 Communication Health Scorer',
    scenario: `You're building a DNP3 link health monitor. Given a snapshot of link statistics,
calculate a health score (0-100) and return a list of active issues.

Implement assessLinkHealth(stats) → { score: number, issues: string[] }

stats object fields:
  crcErrors:         number  (total CRC errors detected)
  timeoutRate:       number  (0.0–1.0, fraction of polls that timed out)
  iinRestartCount:   number  (how many times IIN1.6 was seen since last hour)
  bufferOverflows:   number  (IIN2.3 events since last hour)
  avgResponseMs:     number  (average response time in milliseconds)

Scoring deductions (from 100):
  crcErrors > 0:         -20 per 10 CRC errors (max -40). Issue: 'CRC errors detected — check baud rate and wiring'
  timeoutRate > 0.05:    -25. Issue: 'High timeout rate — check addressing and physical link'
  iinRestartCount > 0:   -15. Issue: 'Device restarts detected — investigate power and firmware stability'
  bufferOverflows > 0:   -20. Issue: 'Event buffer overflow — increase poll frequency or buffer size'
  avgResponseMs > 500:   -10. Issue: 'Slow responses — check CPU load and link congestion'

Clamp score to [0, 100]. Return empty issues array if none apply.`,
    hint: 'Start score at 100. Apply each deduction independently. Use Math.min/max for the CRC error scaling. Push issue strings as conditions are met.',
    starter: `function assessLinkHealth(stats) {
  let score = 100
  const issues = []

  // TODO: deduct for CRC errors (up to -40, deduct 20 per 10 errors)
  // TODO: deduct for timeout rate > 5%
  // TODO: deduct for device restarts
  // TODO: deduct for buffer overflows
  // TODO: deduct for slow responses (>500ms)

  score = Math.max(0, Math.min(100, score))
  return { score, issues }
}

const solution = assessLinkHealth

console.log(assessLinkHealth({ crcErrors:0, timeoutRate:0, iinRestartCount:0, bufferOverflows:0, avgResponseMs:50 }))
console.log(assessLinkHealth({ crcErrors:20, timeoutRate:0.1, iinRestartCount:2, bufferOverflows:0, avgResponseMs:600 }))`,
    starterPy: `def assess_link_health(stats):
    score = 100
    issues = []

    # TODO: apply each deduction and push to issues

    score = max(0, min(100, score))
    return {'score': score, 'issues': issues}

solution = assess_link_health

print(assess_link_health({'crc_errors':0,'timeout_rate':0,'iin_restart_count':0,'buffer_overflows':0,'avg_response_ms':50}))
print(assess_link_health({'crc_errors':20,'timeout_rate':0.1,'iin_restart_count':2,'buffer_overflows':0,'avg_response_ms':600}))`,
    tests: [
      { description: 'All healthy stats → score: 100, issues: []' },
      { description: 'timeoutRate: 0.1 → score deducted 25, timeout issue present' },
      { description: 'crcErrors: 20 → deduct 40 (max CRC deduction)' },
      { description: 'All bad stats → score clamped to 0 minimum' },
    ],
    testRunner: function(solution) {
      function check(input, validator) {
        try {
          const r = solution(input)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check({ crcErrors:0, timeoutRate:0, iinRestartCount:0, bufferOverflows:0, avgResponseMs:50 },
          r => r.score === 100 && Array.isArray(r.issues) && r.issues.length === 0),
        check({ crcErrors:0, timeoutRate:0.1, iinRestartCount:0, bufferOverflows:0, avgResponseMs:50 },
          r => r.score === 75 && r.issues.length > 0),
        check({ crcErrors:20, timeoutRate:0, iinRestartCount:0, bufferOverflows:0, avgResponseMs:50 },
          r => r.score === 60),
        check({ crcErrors:50, timeoutRate:0.5, iinRestartCount:5, bufferOverflows:5, avgResponseMs:1000 },
          r => r.score === 0),
      ]
    },
  },

  lab: {
    id: 'dnp3-ch10-ex',
    title: 'DNP3 Frame Builder',
    scenario: `Build a complete DNP3 Data Link frame from its components.

Implement buildDataLinkFrame(srcAddr, dstAddr, userDataBytes):
  Returns a Uint8Array (or number[] in Python) representing the complete DNP3 Data Link frame.

Frame structure:
  Byte 0:   0x05  (sync byte 1)
  Byte 1:   0x64  (sync byte 2)
  Byte 2:   LENGTH — count from Control byte to end of user data (5 + userDataBytes.length)
  Byte 3:   0x44  (Control: DIR=1, PRM=1, FCB=0, FCV=0, FC=4 = UNCONFIRMED_USER_DATA from master)
  Bytes 4-5: Destination address (little-endian: low byte first)
  Bytes 6-7: Source address (little-endian)
  Bytes 8-9: CRC of bytes 0-7 (low byte first, use provided crc16dnp function)
  Bytes 10+: User data blocks (up to 16 bytes each + 2 CRC bytes appended)

For this exercise, limit userDataBytes to max 16 bytes (one block).
Append the data block CRC immediately after the data bytes.

crc16dnp is already available in scope — use it for all CRC calculations.`,
    hint: 'Build the 8-byte header first (bytes 0-7), compute its CRC, append it. Then append the user data, compute block CRC, append it. Little-endian = low byte first.',
    starter: `function crc16dnp(bytes) {
  let crc = 0xFFFF
  const POLY = 0xA6BC
  for (const byte of bytes) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      crc = (crc & 1) ? (crc >>> 1) ^ POLY : crc >>> 1
    }
  }
  return crc ^ 0xFFFF
}

function buildDataLinkFrame(srcAddr, dstAddr, userDataBytes) {
  if (userDataBytes.length > 16) throw new Error('Max 16 user data bytes for this exercise')

  const frame = []
  // TODO: push sync bytes 0x05, 0x64
  // TODO: push LENGTH = 5 + userDataBytes.length
  // TODO: push Control byte 0x44
  // TODO: push dstAddr low byte, high byte (little-endian)
  // TODO: push srcAddr low byte, high byte
  // TODO: compute CRC of frame[0..7], push CRC low, CRC high
  // TODO: push each user data byte
  // TODO: compute CRC of userDataBytes, push CRC low, CRC high
  return frame
}

const solution = buildDataLinkFrame

const frame = buildDataLinkFrame(0x0001, 0x0005, [0xC0, 0x01, 0x3C, 0x01, 0x06])
console.log(frame.map(b => '0x' + b.toString(16).padStart(2,'0')).join(' '))`,
    starterPy: `def crc16dnp(data):
    crc = 0xFFFF
    POLY = 0xA6BC
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 1:
                crc = (crc >> 1) ^ POLY
            else:
                crc >>= 1
    return crc ^ 0xFFFF

def build_data_link_frame(src_addr, dst_addr, user_data_bytes):
    if len(user_data_bytes) > 16:
        raise ValueError("Max 16 user data bytes for this exercise")
    frame = []
    # TODO: sync bytes, length, control, addresses, header CRC, data, data CRC
    return frame

solution = build_data_link_frame

frame = build_data_link_frame(0x0001, 0x0005, [0xC0, 0x01, 0x3C, 0x01, 0x06])
print([hex(b) for b in frame])`,
    tests: [
      { description: 'Frame starts with [0x05, 0x64]' },
      { description: 'Byte 2 (LENGTH) = 5 + userDataBytes.length' },
      { description: 'Destination address at bytes 4-5 in little-endian order' },
      { description: 'Frame total length = 10 (header) + userDataBytes.length + 2 (block CRC)' },
    ],
    testRunner: function(solution) {
      function crc16dnp(bytes) {
        let crc = 0xFFFF; const P = 0xA6BC
        for (const b of bytes) { crc ^= b; for (let i=0;i<8;i++) crc=(crc&1)?(crc>>>1)^P:crc>>>1 }
        return crc ^ 0xFFFF
      }
      function check(args, validator) {
        try {
          const r = solution(...args)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(Array.from(r).slice(0,12)) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      const data = [0xC0, 0x01, 0x3C, 0x01, 0x06]
      return [
        check([1, 5, data], r => r[0]===0x05 && r[1]===0x64),
        check([1, 5, data], r => r[2] === 5 + data.length),
        check([1, 5, data], r => r[4]===0x05 && r[5]===0x00),
        check([1, 5, data], r => r.length === 10 + data.length + 2),
      ]
    },
  },
}
