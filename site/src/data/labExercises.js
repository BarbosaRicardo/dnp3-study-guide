// DNP3 Code Lab — 3 difficulty levels, 2 exercises each
// Level 1: Protocol mechanics (CRC, frame parsing, IIN decoding)
// Level 2: Application layer logic (polling engine, SBO, event simulation)
// Level 3: Security and full-stack (SA classification, frame reassembly, health monitoring)

export const DNP3_LAB = [

  // ─── LEVEL 1 — Foundations ───────────────────────────────────────────────────
  {
    id: 'dnp3-lab-l1-1',
    level: 1,
    title: 'DNP3 Start Byte Scanner',
    scenario: `You're writing a DNP3 frame boundary detector for a serial port buffer.

Implement findDNP3Frames(buffer):
  Given an array of byte values (integers 0-255), find ALL positions where a valid
  DNP3 frame starts (0x05 followed by 0x64 at the next byte).

Return an array of start indices.

A real serial port buffer might contain garbage bytes from EMI, incomplete frames,
or multiple valid frames concatenated. The scanner should handle all of these.

Examples:
  [0x05, 0x64, 0x14, 0x44] → [0]   (starts at index 0)
  [0xFF, 0x05, 0x64, 0x00] → [1]   (starts at index 1)
  [0x05, 0x64, 0x00, 0xFF, 0x05, 0x64] → [0, 4]  (two frames)
  [0x00, 0x05, 0x00, 0x64] → []    (0x05 and 0x64 not consecutive)`,
    hint: 'Iterate buffer[0..length-2]. At each index i, check if buffer[i] === 0x05 && buffer[i+1] === 0x64. If so, push i.',
    starter: `function findDNP3Frames(buffer) {
  const starts = []
  // TODO: scan for consecutive 0x05 0x64 pairs and collect their start indices
  return starts
}

const solution = findDNP3Frames

console.log(findDNP3Frames([0x05, 0x64, 0x14, 0x44]))               // [0]
console.log(findDNP3Frames([0xFF, 0x05, 0x64, 0x00]))               // [1]
console.log(findDNP3Frames([0x05, 0x64, 0x00, 0xFF, 0x05, 0x64]))  // [0, 4]
console.log(findDNP3Frames([0x00, 0x05, 0x00, 0x64]))               // []`,
    starterPy: `def find_dnp3_frames(buffer):
    starts = []
    # TODO: scan for 0x05 followed by 0x64 and collect start indices
    return starts

solution = find_dnp3_frames

print(find_dnp3_frames([0x05, 0x64, 0x14, 0x44]))
print(find_dnp3_frames([0xFF, 0x05, 0x64, 0x00]))
print(find_dnp3_frames([0x05, 0x64, 0x00, 0xFF, 0x05, 0x64]))
print(find_dnp3_frames([0x00, 0x05, 0x00, 0x64]))`,
    starterJython: `def find_dnp3_frames(buffer):
    starts = []
    # Jython 2.7 — no enumerate needed, use range
    for i in range(len(buffer) - 1):
        if buffer[i] == 0x05 and buffer[i+1] == 0x64:
            starts.append(i)
    return starts

solution = find_dnp3_frames`,
    tests: [
      { description: '[0x05,0x64,...] → [0] (frame at index 0)' },
      { description: '[0xFF,0x05,0x64,...] → [1] (frame after garbage byte)' },
      { description: 'Two embedded frames → returns two start indices' },
      { description: 'Non-consecutive 0x05 0x64 → [] (no match)' },
    ],
    testRunner: function(solution) {
      function check(input, expected) {
        try {
          const r = solution(input)
          const pass = Array.isArray(r) && r.length === expected.length && expected.every((v,i) => r[i] === v)
          return { passed: pass, expected: JSON.stringify(expected), actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check([0x05,0x64,0x14,0x44], [0]),
        check([0xFF,0x05,0x64,0x00], [1]),
        check([0x05,0x64,0x00,0xFF,0x05,0x64], [0,4]),
        check([0x00,0x05,0x00,0x64], []),
      ]
    },
  },

  {
    id: 'dnp3-lab-l1-2',
    level: 1,
    title: 'DNP3 Address Validator',
    scenario: `DNP3 uses 16-bit addresses. Not all values are valid device addresses.
Implement classifyAddress(addr) → { valid: boolean, type: string, description: string }

Address ranges:
  0x0000           → { valid: true,  type: 'device', description: 'Valid device address' }
  0x0001–0xFFF9    → { valid: true,  type: 'device', description: 'Valid device address' }
  0xFFFA–0xFFFE    → { valid: false, type: 'reserved', description: 'Reserved — do not use' }
  0xFFFF           → { valid: true,  type: 'broadcast', description: 'Broadcast — all outstations, no response expected' }
  < 0 or > 0xFFFF  → { valid: false, type: 'invalid', description: 'Out of 16-bit range' }

Also implement:
  isBroadcast(addr) → boolean
  isReserved(addr)  → boolean`,
    hint: 'Check the ranges in order: out-of-range first, then 0xFFFF broadcast, then 0xFFFA-0xFFFE reserved, then valid.',
    starter: `function classifyAddress(addr) {
  // TODO: handle out-of-range, broadcast (0xFFFF), reserved (0xFFFA-0xFFFE), valid device
  return { valid: false, type: 'invalid', description: 'Not implemented' }
}

function isBroadcast(addr) {
  return addr === 0xFFFF
}

function isReserved(addr) {
  return addr >= 0xFFFA && addr <= 0xFFFE
}

const solution = classifyAddress

console.log(classifyAddress(5))       // valid device
console.log(classifyAddress(0xFFFF))  // broadcast
console.log(classifyAddress(0xFFFC))  // reserved
console.log(classifyAddress(-1))      // out of range`,
    starterPy: `def classify_address(addr):
    # TODO: check ranges in order
    return {'valid': False, 'type': 'invalid', 'description': 'Not implemented'}

def is_broadcast(addr):
    return addr == 0xFFFF

def is_reserved(addr):
    return 0xFFFA <= addr <= 0xFFFE

solution = classify_address

print(classify_address(5))
print(classify_address(0xFFFF))
print(classify_address(0xFFFC))
print(classify_address(-1))`,
    starterJython: `def classify_address(addr):
    if addr < 0 or addr > 0xFFFF:
        return {'valid': False, 'type': 'invalid', 'description': 'Out of 16-bit range'}
    # TODO: add broadcast and reserved checks
    return {'valid': True, 'type': 'device', 'description': 'Valid device address'}

solution = classify_address`,
    tests: [
      { description: 'classifyAddress(5) → valid:true, type:device' },
      { description: 'classifyAddress(0xFFFF) → valid:true, type:broadcast' },
      { description: 'classifyAddress(0xFFFC) → valid:false, type:reserved' },
      { description: 'classifyAddress(-1) → valid:false, type:invalid' },
    ],
    testRunner: function(solution) {
      function check(addr, validator) {
        try {
          const r = solution(addr)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check(5,      r => r.valid === true  && r.type === 'device'),
        check(0xFFFF, r => r.valid === true  && r.type === 'broadcast'),
        check(0xFFFC, r => r.valid === false && r.type === 'reserved'),
        check(-1,     r => r.valid === false && r.type === 'invalid'),
      ]
    },
  },

  // ─── LEVEL 2 — Applied ───────────────────────────────────────────────────────
  {
    id: 'dnp3-lab-l2-1',
    level: 2,
    title: 'DNP3 Poll Scheduler',
    scenario: `A DNP3 master must schedule multiple poll types with different intervals.
Implement a poll scheduler that determines which polls are due at a given time.

Poll types and their default intervals (ms):
  'class0':  30000  (30 seconds — full static snapshot)
  'class1':   5000  (5 seconds — high priority events)
  'class2':  10000  (10 seconds — medium priority events)
  'class3':  30000  (30 seconds — low priority events)
  'integrity': 300000 (5 minutes — full integrity poll)

Implement:
  getDuePolls(lastPollTimes, nowMs)
    lastPollTimes: { class0: number, class1: number, ... } (timestamp of last poll, or 0 if never)
    nowMs: current timestamp

  Returns: string[] of poll type names that are due (elapsed >= interval).
  Always return class1 first if it's due (highest priority).`,
    hint: 'Build INTERVALS map. For each poll type, compute elapsed = nowMs - lastPollTimes[type]. If elapsed >= interval, add to due list. Sort: class1 first, then others.',
    starter: `const INTERVALS = {
  class0:    30000,
  class1:     5000,
  class2:    10000,
  class3:    30000,
  integrity: 300000,
}

function getDuePolls(lastPollTimes, nowMs) {
  const due = []
  // TODO: for each poll type, check if elapsed >= interval
  // TODO: sort so class1 is first if present
  return due
}

const solution = getDuePolls

// t=0 — nothing ever polled — all should be due
console.log(getDuePolls({ class0:0, class1:0, class2:0, class3:0, integrity:0 }, 1000))

// t=6000ms — only class1 (5s) is due; class0 was polled at t=0
console.log(getDuePolls({ class0:1000, class1:0, class2:5500, class3:0, integrity:0 }, 6000))`,
    starterPy: `INTERVALS = {
    'class0':    30000,
    'class1':     5000,
    'class2':    10000,
    'class3':    30000,
    'integrity': 300000,
}

def get_due_polls(last_poll_times, now_ms):
    due = []
    # TODO: check each poll type, collect due ones, sort class1 first
    return due

solution = get_due_polls

print(get_due_polls({'class0':0,'class1':0,'class2':0,'class3':0,'integrity':0}, 1000))
print(get_due_polls({'class0':1000,'class1':0,'class2':5500,'class3':0,'integrity':0}, 6000))`,
    starterJython: `INTERVALS = {
    'class0':    30000,
    'class1':     5000,
    'class2':    10000,
    'class3':    30000,
    'integrity': 300000,
}

def get_due_polls(last_poll_times, now_ms):
    due = []
    for poll_type, interval in INTERVALS.items():
        elapsed = now_ms - last_poll_times.get(poll_type, 0)
        if elapsed >= interval:
            due.append(poll_type)
    if 'class1' in due:
        due.remove('class1')
        due.insert(0, 'class1')
    return due

solution = get_due_polls`,
    tests: [
      { description: 'All lastPollTimes=0 at t=1000ms → all polls due' },
      { description: 'class1 due → appears first in returned list' },
      { description: 'class0 polled 1s ago at t=6s → class0 not yet due (needs 30s)' },
      { description: 'No polls due → returns empty array' },
    ],
    testRunner: function(solution) {
      function check(times, now, validator) {
        try {
          const r = solution(times, now)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check({class0:0,class1:0,class2:0,class3:0,integrity:0}, 1000,
          r => Array.isArray(r) && r.includes('class0') && r.includes('class1')),
        check({class0:0,class1:0,class2:0,class3:0,integrity:0}, 1000,
          r => Array.isArray(r) && r[0] === 'class1'),
        check({class0:1000,class1:1000,class2:1000,class3:1000,integrity:1000}, 6000,
          r => Array.isArray(r) && r.includes('class1') && !r.includes('class0')),
        check({class0:0,class1:0,class2:0,class3:0,integrity:0}, 0,
          r => Array.isArray(r) && r.length === 0),
      ]
    },
  },

  {
    id: 'dnp3-lab-l2-2',
    level: 2,
    title: 'DNP3 Event Buffer Simulator',
    scenario: `Simulate a DNP3 outstation's event buffer with class assignment and overflow handling.

Implement an EventBuffer class (or object factory) with:

  EventBuffer(maxSize)  — create buffer with capacity maxSize

  addEvent(pointIndex, eventClass, value, timestampMs)
    Add event to buffer. If buffer is full (size === maxSize), drop the OLDEST event
    and set the overflow flag.

  getEvents(eventClass)
    Return all buffered events for the given class (1, 2, or 3) in insertion order.
    Events are NOT removed from buffer by this call.

  confirmEvents(eventClass)
    Remove all events for this class from the buffer. Clear overflow flag if buffer no longer full.

  isOverflowed() → boolean

Events are objects: { pointIndex, eventClass, value, timestampMs }`,
    hint: 'Use an array as the buffer. addEvent pushes to end; if over capacity, shift() the oldest. Track overflow with a flag. getEvents filters by class. confirmEvents filters out that class.',
    starter: `function EventBuffer(maxSize) {
  let buffer = []
  let overflowed = false

  function addEvent(pointIndex, eventClass, value, timestampMs) {
    // TODO: if buffer.length >= maxSize, shift oldest and set overflowed=true
    // TODO: push new event { pointIndex, eventClass, value, timestampMs }
  }

  function getEvents(eventClass) {
    // TODO: return events matching eventClass in insertion order
    return []
  }

  function confirmEvents(eventClass) {
    // TODO: remove events matching eventClass from buffer
    // TODO: clear overflowed if buffer is now below capacity
  }

  function isOverflowed() { return overflowed }

  return { addEvent, getEvents, confirmEvents, isOverflowed }
}

const solution = EventBuffer

const buf = EventBuffer(3)
buf.addEvent(0, 1, true, 1000)
buf.addEvent(1, 2, 42.5, 2000)
buf.addEvent(0, 1, false, 3000)
console.log('Class 1 events:', buf.getEvents(1))
console.log('Overflowed:', buf.isOverflowed())
buf.addEvent(2, 3, 100, 4000)  // should trigger overflow, drop oldest
console.log('Overflowed after full:', buf.isOverflowed())`,
    starterPy: `def EventBuffer(max_size):
    buffer = []
    state = {'overflowed': False}

    def add_event(point_index, event_class, value, timestamp_ms):
        if len(buffer) >= max_size:
            buffer.pop(0)
            state['overflowed'] = True
        buffer.append({'point_index': point_index, 'event_class': event_class,
                       'value': value, 'timestamp_ms': timestamp_ms})

    def get_events(event_class):
        return [e for e in buffer if e['event_class'] == event_class]

    def confirm_events(event_class):
        while True:
            found = next((e for e in buffer if e['event_class'] == event_class), None)
            if not found:
                break
            buffer.remove(found)
        if len(buffer) < max_size:
            state['overflowed'] = False

    def is_overflowed():
        return state['overflowed']

    return {'add_event': add_event, 'get_events': get_events,
            'confirm_events': confirm_events, 'is_overflowed': is_overflowed}

solution = EventBuffer`,
    starterJython: `def EventBuffer(max_size):
    buffer = []
    overflowed = [False]

    def add_event(point_index, event_class, value, timestamp_ms):
        if len(buffer) >= max_size:
            buffer.pop(0)
            overflowed[0] = True
        buffer.append({'point_index': point_index, 'event_class': event_class,
                       'value': value, 'timestamp_ms': timestamp_ms})

    def is_overflowed():
        return overflowed[0]

    return {'add_event': add_event, 'is_overflowed': is_overflowed}

solution = EventBuffer`,
    tests: [
      { description: 'addEvent stores events retrievable by getEvents(class)' },
      { description: 'Buffer at capacity + new event → oldest dropped, isOverflowed()=true' },
      { description: 'confirmEvents(1) removes class 1 events from buffer' },
      { description: 'getEvents returns events in insertion order' },
    ],
    testRunner: function(solution) {
      function check(validator, desc) {
        try {
          const passed = validator()
          return { passed, expected: desc, actual: passed ? 'passed' : 'failed' }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check(() => {
          const buf = solution(5)
          buf.addEvent(0, 1, true, 1000)
          buf.addEvent(1, 2, 42, 2000)
          const ev = buf.getEvents(1)
          return Array.isArray(ev) && ev.length === 1
        }, 'addEvent + getEvents by class'),
        check(() => {
          const buf = solution(2)
          buf.addEvent(0, 1, true, 1000)
          buf.addEvent(1, 1, false, 2000)
          buf.addEvent(2, 1, true, 3000) // triggers overflow
          return buf.isOverflowed() === true
        }, 'overflow on full buffer'),
        check(() => {
          const buf = solution(5)
          buf.addEvent(0, 1, true, 1000)
          buf.addEvent(1, 2, 5, 2000)
          buf.confirmEvents(1)
          const ev = buf.getEvents(1)
          return Array.isArray(ev) && ev.length === 0
        }, 'confirmEvents removes class events'),
        check(() => {
          const buf = solution(5)
          buf.addEvent(0, 1, true, 1000)
          buf.addEvent(1, 1, false, 2000)
          const ev = buf.getEvents(1)
          return Array.isArray(ev) && ev[0].timestampMs === 1000 && ev[1].timestampMs === 2000
        }, 'insertion order preserved'),
      ]
    },
  },

  // ─── LEVEL 3 — Graduate ──────────────────────────────────────────────────────
  {
    id: 'dnp3-lab-l3-1',
    level: 3,
    title: 'DNP3 Transport Layer Reassembler',
    scenario: `Implement a DNP3 Transport Layer reassembler that reconstructs Application Layer messages
from a sequence of Transport segments.

Transport Layer header byte:
  Bit 7 (0x80) = FIN (final segment)
  Bit 6 (0x40) = FIR (first segment)
  Bits 0-5     = sequence number (0-63)

Implement reassemble(segments):
  segments: array of Uint8Array (or number[]) — each starts with the transport header byte
             followed by up to 249 bytes of application data.

Returns: { apdu: number[], complete: boolean, error: string|null }

Rules:
  1. First segment must have FIR=1. If not, return error: 'Missing FIR on first segment'
  2. Each subsequent segment must have FIR=0 and sequence number = (prev + 1) % 64
     If sequence is out of order, return error: 'Sequence gap at segment N'
  3. If last segment has FIN=1, return complete:true with APDU = all data bytes concatenated (no headers)
  4. If no FIN received yet, return complete:false, apdu: data collected so far

Examples:
  Single segment [0xC0, 0x01, 0x3C, 0x01, 0x06] → FIR=1 FIN=1 seq=0 → complete APDU [0x01, 0x3C, 0x01, 0x06]
  Two segments:
    [0x40, ...data1...]  FIR=1 FIN=0 seq=0
    [0x80, ...data2...]  FIR=0 FIN=1 seq=1
    → complete APDU = data1 + data2`,
    hint: 'Extract FIR=(byte>>6)&1, FIN=(byte>>7)&1, seq=byte&0x3F for each segment. Track expected sequence. Concatenate data bytes (all bytes after index 0) into running APDU buffer.',
    starter: `function reassemble(segments) {
  if (!segments || segments.length === 0) {
    return { apdu: [], complete: false, error: 'No segments' }
  }

  let apdu = []
  let expectedSeq = -1

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const header = seg[0]
    const fir = (header >> 6) & 1
    const fin = (header >> 7) & 1
    const seq = header & 0x3F
    const data = Array.from(seg).slice(1)

    if (i === 0) {
      // TODO: verify FIR=1 on first segment
      // TODO: set expectedSeq = (seq + 1) % 64
    } else {
      // TODO: verify FIR=0 and seq === expectedSeq
      // TODO: advance expectedSeq
    }

    // TODO: append data bytes to apdu

    if (fin) {
      return { apdu, complete: true, error: null }
    }
  }

  return { apdu, complete: false, error: null }
}

const solution = reassemble

// Single fragment (FIR=1, FIN=1, seq=0)
console.log(reassemble([[0xC0, 0x01, 0x3C, 0x01, 0x06]]))

// Two fragments
console.log(reassemble([
  [0x40, 0xAA, 0xBB],    // FIR=1 FIN=0 seq=0
  [0x81, 0xCC, 0xDD],    // FIR=0 FIN=1 seq=1
]))

// Missing FIR
console.log(reassemble([[0x80, 0x01, 0x02]]))`,
    starterPy: `def reassemble(segments):
    if not segments:
        return {'apdu': [], 'complete': False, 'error': 'No segments'}

    apdu = []
    expected_seq = -1

    for i, seg in enumerate(segments):
        header = seg[0]
        fir = (header >> 6) & 1
        fin = (header >> 7) & 1
        seq = header & 0x3F
        data = list(seg[1:])

        if i == 0:
            # TODO: check FIR=1
            expected_seq = (seq + 1) % 64
        else:
            # TODO: check FIR=0 and seq matches expected
            expected_seq = (seq + 1) % 64

        apdu.extend(data)

        if fin:
            return {'apdu': apdu, 'complete': True, 'error': None}

    return {'apdu': apdu, 'complete': False, 'error': None}

solution = reassemble`,
    starterJython: `def reassemble(segments):
    if not segments:
        return {'apdu': [], 'complete': False, 'error': 'No segments'}
    apdu = []
    for i, seg in enumerate(segments):
        header = seg[0]
        fin = (header >> 7) & 1
        apdu.extend(seg[1:])
        if fin:
            return {'apdu': apdu, 'complete': True, 'error': None}
    return {'apdu': apdu, 'complete': False, 'error': None}

solution = reassemble`,
    tests: [
      { description: 'Single segment FIR=FIN=1 → complete APDU without header byte' },
      { description: 'Two segments, correct sequence → complete APDU = data1+data2' },
      { description: 'First segment missing FIR → error returned' },
      { description: 'Sequence gap in multi-segment → error at gap index' },
    ],
    testRunner: function(solution) {
      function check(input, validator) {
        try {
          const r = solution(input)
          return { passed: validator(r), expected: 'see description', actual: JSON.stringify(r) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check([[0xC0, 0x01, 0x3C, 0x01, 0x06]],
          r => r.complete === true && r.error === null && Array.isArray(r.apdu) && r.apdu[0] === 0x01),
        check([[0x40, 0xAA, 0xBB], [0x81, 0xCC, 0xDD]],
          r => r.complete === true && r.apdu.length === 4 && r.apdu[0] === 0xAA && r.apdu[2] === 0xCC),
        check([[0x80, 0x01, 0x02]],
          r => r.error !== null && typeof r.error === 'string' && r.error.length > 0),
        check([[0x40, 0xAA], [0x82, 0xBB]],
          r => r.error !== null),
      ]
    },
  },

  {
    id: 'dnp3-lab-l3-2',
    level: 3,
    title: 'DNP3 Master State Machine',
    scenario: `Implement a simplified DNP3 master communication state machine.
The master must follow the correct startup and steady-state sequence.

States:
  IDLE → LINK_RESET → CLASS0_POLL → ENABLE_UNSOL → STEADY_STATE → ERROR

Implement DNP3Master(outstationAddr):
  Expose a step(event) method that transitions the state machine.

Events (strings):
  'start'            — begin communication
  'link_ack'         — received ACK for RESET_LINK_STATES
  'class0_response'  — received full Class 0 response
  'unsol_enabled'    — outstation confirmed ENABLE_UNSOLICITED
  'iin_restart'      — IIN1.6 seen (device restart) — go back to CLASS0_POLL
  'link_timeout'     — no response at data link layer → ERROR
  'comms_restored'   — after ERROR, retry → LINK_RESET

step(event) returns: { state: string, action: string }
  action is what the master should DO next as a result of the transition.

Action descriptions:
  IDLE → 'start'           → action: 'send RESET_LINK_STATES'
  LINK_RESET → 'link_ack'  → action: 'send Class 0 poll'
  CLASS0_POLL → 'class0_response' → action: 'send ENABLE_UNSOLICITED'
  ENABLE_UNSOL → 'unsol_enabled'  → action: 'begin steady-state polling'
  STEADY_STATE → 'iin_restart'    → action: 'send time sync, then Class 0 poll'
  any → 'link_timeout'            → action: 'log error, wait for reconnect'
  ERROR → 'comms_restored'        → action: 'send RESET_LINK_STATES'`,
    hint: 'Use a state variable and a transition table (object keyed by state → event → {nextState, action}). step() looks up current state + event, updates state, returns result.',
    starter: `function DNP3Master(outstationAddr) {
  let state = 'IDLE'

  const TRANSITIONS = {
    IDLE: {
      start: { next: 'LINK_RESET', action: 'send RESET_LINK_STATES' },
    },
    LINK_RESET: {
      link_ack:     { next: 'CLASS0_POLL', action: 'send Class 0 poll' },
      link_timeout: { next: 'ERROR',       action: 'log error, wait for reconnect' },
    },
    CLASS0_POLL: {
      class0_response: { next: 'ENABLE_UNSOL', action: 'send ENABLE_UNSOLICITED' },
      link_timeout:    { next: 'ERROR',         action: 'log error, wait for reconnect' },
    },
    ENABLE_UNSOL: {
      unsol_enabled: { next: 'STEADY_STATE', action: 'begin steady-state polling' },
      link_timeout:  { next: 'ERROR',        action: 'log error, wait for reconnect' },
    },
    STEADY_STATE: {
      iin_restart:  { next: 'CLASS0_POLL', action: 'send time sync, then Class 0 poll' },
      link_timeout: { next: 'ERROR',       action: 'log error, wait for reconnect' },
    },
    ERROR: {
      comms_restored: { next: 'LINK_RESET', action: 'send RESET_LINK_STATES' },
    },
  }

  function step(event) {
    // TODO: look up TRANSITIONS[state][event]
    // TODO: if found: update state, return { state: newState, action }
    // TODO: if not found: return { state, action: 'unexpected event: ' + event }
    return { state, action: 'not implemented' }
  }

  function getState() { return state }

  return { step, getState }
}

const solution = DNP3Master

const master = DNP3Master(5)
console.log(master.step('start'))           // LINK_RESET
console.log(master.step('link_ack'))        // CLASS0_POLL
console.log(master.step('class0_response')) // ENABLE_UNSOL
console.log(master.step('unsol_enabled'))   // STEADY_STATE
console.log(master.step('iin_restart'))     // CLASS0_POLL (restart recovery)`,
    starterPy: `def DNP3Master(outstation_addr):
    state = ['IDLE']

    TRANSITIONS = {
        'IDLE':        {'start':           ('LINK_RESET',   'send RESET_LINK_STATES')},
        'LINK_RESET':  {'link_ack':        ('CLASS0_POLL',  'send Class 0 poll'),
                        'link_timeout':    ('ERROR',        'log error, wait for reconnect')},
        'CLASS0_POLL': {'class0_response': ('ENABLE_UNSOL', 'send ENABLE_UNSOLICITED'),
                        'link_timeout':    ('ERROR',        'log error, wait for reconnect')},
        'ENABLE_UNSOL':{'unsol_enabled':   ('STEADY_STATE', 'begin steady-state polling'),
                        'link_timeout':    ('ERROR',        'log error, wait for reconnect')},
        'STEADY_STATE':{'iin_restart':     ('CLASS0_POLL',  'send time sync, then Class 0 poll'),
                        'link_timeout':    ('ERROR',        'log error, wait for reconnect')},
        'ERROR':       {'comms_restored':  ('LINK_RESET',   'send RESET_LINK_STATES')},
    }

    def step(event):
        transitions = TRANSITIONS.get(state[0], {})
        if event in transitions:
            next_state, action = transitions[event]
            state[0] = next_state
            return {'state': next_state, 'action': action}
        return {'state': state[0], 'action': 'unexpected event: ' + event}

    def get_state():
        return state[0]

    return {'step': step, 'get_state': get_state}

solution = DNP3Master`,
    starterJython: `def DNP3Master(outstation_addr):
    state = ['IDLE']
    def step(event):
        return {'state': state[0], 'action': 'not implemented in Jython starter'}
    def get_state():
        return state[0]
    return {'step': step, 'get_state': get_state}

solution = DNP3Master`,
    tests: [
      { description: 'IDLE + start → LINK_RESET, action includes RESET_LINK_STATES' },
      { description: 'LINK_RESET + link_ack → CLASS0_POLL' },
      { description: 'Full startup sequence: IDLE→LINK_RESET→CLASS0_POLL→ENABLE_UNSOL→STEADY_STATE' },
      { description: 'STEADY_STATE + iin_restart → CLASS0_POLL (restart recovery)' },
    ],
    testRunner: function(solution) {
      function check(events, validator) {
        try {
          const master = solution(5)
          let last
          for (const ev of events) last = master.step(ev)
          return { passed: validator(last, master), expected: 'see description', actual: JSON.stringify(last) }
        } catch(e) { return { passed: false, error: e.message } }
      }
      return [
        check(['start'], (r, m) => m.getState() === 'LINK_RESET' && r.action && r.action.includes('RESET')),
        check(['start','link_ack'], (r, m) => m.getState() === 'CLASS0_POLL'),
        check(['start','link_ack','class0_response','unsol_enabled'],
          (r, m) => m.getState() === 'STEADY_STATE'),
        check(['start','link_ack','class0_response','unsol_enabled','iin_restart'],
          (r, m) => m.getState() === 'CLASS0_POLL'),
      ]
    },
  },
]
