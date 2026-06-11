// Maps chapters to the company skills-matrix (survey) competencies they cover.
// Source: RTAC Automation matrix (DNP3 client/server) + SCADA Operations matrix
// (DNP3 OPC device config in Ignition). A chapter listed here is "on the survey".

export const TRACKS = {
  scada: { label: 'SCADA OPS', color: '#fb923c' },
  rtac: { label: 'RTAC AUTO', color: '#818cf8' },
}

export const MATRIX_MAP = {
  intro: [
    { track: 'scada', week: 2, category: 'DNP3 OPC Device Configuration',
      skills: ['Configure a DNP3 OPC device in Ignition (foundation)'] },
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Interpret DNP3 comm parameters and populate RTAC channel (foundation)'] },
  ],
  layers: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Interpret DNP3 comm parameters and populate RTAC channel'] },
  ],
  datalink: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Interpret DNP3 comm parameters and populate RTAC channel',
               'Troubleshoot DNP3 communications'] },
  ],
  appLayer: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Configure custom polls', 'Troubleshoot DNP3 communications'] },
    { track: 'scada', week: 2, category: 'DNP3 OPC Device Configuration',
      skills: ['Understand polling, unsolicited messaging & time sync'] },
  ],
  objects: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Create tags from vendor point maps'] },
    { track: 'rtac', week: 3, category: 'DNP3 Server Channel Config',
      skills: ['Create tags from third-party maps / system requirements'] },
  ],
  fc: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Configure custom polls',
               'Troubleshoot tag discrepancies and conduct P2P'] },
  ],
  unsol: [
    { track: 'scada', week: 2, category: 'DNP3 OPC Device Configuration',
      skills: ['Understand polling, unsolicited messaging & time sync'] },
    { track: 'rtac', week: 3, category: 'DNP3 Server Channel Config',
      skills: ['Interpret DNP3 server comm parameters'] },
  ],
  troubleshoot: [
    { track: 'scada', week: 2, category: 'DNP3 OPC Device Configuration',
      skills: ['Diagnose common DNP3 communication problems'] },
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Troubleshoot DNP3 communications',
               'Troubleshoot tag discrepancies and conduct P2P'] },
    { track: 'rtac', week: 3, category: 'DNP3 Server Channel Config',
      skills: ['Troubleshoot DNP3 server communications and P2P'] },
  ],
  lab: [
    { track: 'rtac', week: 3, category: 'DNP3 Client Channel Config',
      skills: ['Create tags from vendor point maps (hands-on)',
               'Configure custom polls (hands-on)'] },
  ],
  // security (Secure Authentication): valuable, but not a matrix line item
}

export const isOnMatrix = (chapterId) => Boolean(MATRIX_MAP[chapterId]?.length)
