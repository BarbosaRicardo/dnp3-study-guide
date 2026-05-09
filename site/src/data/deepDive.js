// Deep-dive resources shown after passing each level.
// YouTube entries use a search query so links never go stale.

const yt = (q, title) => ({
  type: 'youtube',
  title,
  searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
})
const doc = (title, url) => ({ type: 'doc', title, url })
const book = (title, author, chapter, page) => ({ type: 'book', title, author, chapter, page })

const clarke  = (ch, pg) => book('Practical Modern SCADA Protocols', 'Clarke & Reynders', ch, pg)
const kurose  = (ch, pg) => book('Computer Networking: A Top-Down Approach', 'Kurose & Ross, 7th ed.', ch, pg)

export const DEEP_DIVE = {
  intro: {
    level1: [
      yt('DNP3 protocol explained SCADA tutorial', 'DNP3 Protocol Explained — SCADA Tutorial'),
      yt('DNP3 vs Modbus difference IEC 60870', 'DNP3 vs Modbus — Key Differences Explained'),
      doc('DNP3 Users Group — Technical Bulletins', 'https://www.dnp.org/About/Technical-Information'),
      clarke('Chapter 3: DNP3 Protocol Overview', '105'),
    ],
    level2: [
      yt('DNP3 Wireshark dissector capture analysis', 'Analyzing DNP3 Traffic with Wireshark'),
      yt('IEC 60870-5 DNP3 protocol comparison utility SCADA', 'IEC 60870-5 vs DNP3 — Protocol Comparison'),
      doc('IEEE 1815-2012 DNP3 Standard', 'https://standards.ieee.org/ieee/1815/4896/'),
      clarke('Chapter 3: DNP3 History and IEC 60870-5 Origins', '108'),
    ],
  },

  layers: {
    level1: [
      yt('DNP3 protocol stack layers explained', 'DNP3 Protocol Stack — All Four Layers'),
      yt('OSI model explained SCADA industrial protocols', 'OSI Model vs DNP3 Pseudo-Stack'),
      clarke('Chapter 3: DNP3 Layer Architecture', '112'),
    ],
    level2: [
      yt('DNP3 transport layer function segmentation', 'DNP3 Transport Layer — Segmentation and Reassembly'),
      yt('DNP3 data link layer framing CRC tutorial', 'DNP3 Data Link Layer Deep Dive'),
      clarke('Chapter 3: DNP3 Layer Interactions and PDU Wrapping', '117'),
    ],
  },

  datalink: {
    level1: [
      yt('DNP3 data link layer frame structure 0564', 'DNP3 Data Link Frame — 0x0564 Start Bytes Explained'),
      yt('CRC-16 DNP calculation checksum tutorial', 'DNP3 CRC-16 Calculation — Step by Step'),
      yt('DNP3 source destination address direction bit', 'DNP3 Addressing — Source, Destination, Direction Bit'),
      clarke('Chapter 3: Data Link Layer Frame Format', '120'),
    ],
    level2: [
      yt('DNP3 data link layer primary secondary frames', 'DNP3 Primary vs Secondary Data Link Frames'),
      yt('DNP3 link layer reset request link status', 'DNP3 Link Layer Control Functions'),
      doc('DNP3 Users Group — Basic Application Layer Guidelines', 'https://www.dnp.org/AboutUs/DNP3-Primer-Rev-A.pdf'),
      clarke('Chapter 3: Data Link Layer Control Fields', '126'),
    ],
  },

  appLayer: {
    level1: [
      yt('DNP3 application layer APDU structure explained', 'DNP3 APDU — Application Layer PDU Structure'),
      yt('DNP3 IIN bits internal indications explained', 'DNP3 IIN Bits — Decoding Internal Indications'),
      yt('DNP3 fragmentation application confirm mechanism', 'DNP3 Application Layer Fragmentation and Confirm'),
      clarke('Chapter 3: Application Layer Structure', '132'),
    ],
    level2: [
      yt('DNP3 application control field ACK FIR FIN bits', 'DNP3 Application Control Field — FIR, FIN, CON, UNS'),
      yt('DNP3 confirm response sequence number', 'DNP3 Application Sequence Numbers and Confirmations'),
      doc('IEEE 1815-2012 — Section 7: Application Layer', 'https://standards.ieee.org/ieee/1815/4896/'),
      clarke('Chapter 3: Application Layer Fragmentation', '138'),
    ],
  },

  objects: {
    level1: [
      yt('DNP3 group variation objects explained tutorial', 'DNP3 Group/Variation System — Every Object Type Explained'),
      yt('DNP3 binary input analog input counter objects', 'DNP3 Data Objects — Binary, Analog, Counter Groups'),
      clarke('Chapter 3: DNP3 Object Library', '145'),
    ],
    level2: [
      yt('DNP3 object headers qualifier codes prefix', 'DNP3 Object Headers — Qualifier Codes and Prefixes'),
      yt('DNP3 analog input Group 30 variation 1 2 3 4 5', 'DNP3 Group 30 Analog Input Variations Explained'),
      doc('DNP3 Device Profile — Object Library Reference', 'https://www.dnp.org/About/Technical-Information'),
      clarke('Chapter 3: Object Groups and Variations Reference', '151'),
    ],
  },

  fc: {
    level1: [
      yt('DNP3 function codes read write direct operate explained', 'DNP3 Function Codes — Every FC Explained'),
      yt('DNP3 select before operate SBO tutorial', 'DNP3 Select-Before-Operate — Why Two Steps?'),
      clarke('Chapter 3: Function Codes and Control Operations', '158'),
    ],
    level2: [
      yt('DNP3 direct operate vs select before operate difference', 'DNP3 Direct Operate vs SBO — When to Use Each'),
      yt('DNP3 response function codes 0x81 0x82 unsolicited', 'DNP3 Response vs Unsolicited Response Function Codes'),
      doc('IEEE 1815-2012 — Function Code Reference Table', 'https://standards.ieee.org/ieee/1815/4896/'),
      clarke('Chapter 3: Advanced Control Function Codes', '163'),
    ],
  },

  unsol: {
    level1: [
      yt('DNP3 unsolicited response explained event reporting', 'DNP3 Unsolicited Responses — Event-Driven Reporting'),
      yt('DNP3 class 1 2 3 event buffers polling', 'DNP3 Event Classes — Class 0 vs Class 1/2/3'),
      clarke('Chapter 3: Unsolicited Responses and Event Management', '170'),
    ],
    level2: [
      yt('DNP3 unsolicited enable disable configuration', 'DNP3 Unsolicited Enable/Disable — Configuration and Timing'),
      yt('DNP3 event buffer overflow class 1 2 3 priority', 'DNP3 Event Buffer Management and Overflow Handling'),
      doc('DNP3 Users Group — Event Reporting Guidelines', 'https://www.dnp.org/About/Technical-Information'),
      clarke('Chapter 3: Unsolicited Confirm and Retry Mechanisms', '177'),
    ],
  },

  security: {
    level1: [
      yt('DNP3 Secure Authentication SA v5 explained', 'DNP3 Secure Authentication v5 — How It Works'),
      yt('DNP3 HMAC replay protection IEC 62351', 'DNP3 SA — HMAC, Replay Protection, IEC 62351-5'),
      doc('IEC 62351-5 DNP3 Security Standard', 'https://webstore.iec.ch/publication/6995'),
      clarke('Chapter 5: DNP3 Secure Authentication', '215'),
    ],
    level2: [
      yt('DNP3 SA v2 vs SA v5 differences migration', 'DNP3 SA v2 vs SA v5 — Key Differences'),
      yt('DNP3 aggressive mode authentication key management', 'DNP3 Aggressive Mode Authentication'),
      doc('NERC CIP-007-6 — System Security Management', 'https://www.nerc.com/pa/Stand/Pages/CIPStandards.aspx'),
      kurose('Chapter 8: Security in Computer Networks', '574'),
    ],
  },

  troubleshoot: {
    level1: [
      yt('DNP3 troubleshooting CRC errors timeout debugging', 'DNP3 Troubleshooting — CRC Errors, Timeouts, IIN Bits'),
      yt('Wireshark DNP3 dissector capture filter tutorial', 'Wireshark DNP3 — Capture Filter and Frame Decode'),
      clarke('Chapter 6: DNP3 Installation and Commissioning', '235'),
    ],
    level2: [
      yt('DNP3 analyzer tool Triangle MicroWorks testing', 'Triangle MicroWorks DNP3 Test Harness Tutorial'),
      yt('DNP3 malformed frame IIN bit decode field troubleshooting', 'DNP3 Field Troubleshooting — IIN Bit Decoding'),
      doc('DNP3 Primer Rev A — Troubleshooting Guide', 'https://www.dnp.org/AboutUs/DNP3-Primer-Rev-A.pdf'),
      clarke('Chapter 6: Common DNP3 Faults and Diagnostics', '241'),
    ],
  },

  lab: {
    level1: [
      yt('OpenDNP3 tutorial simulator Python', 'OpenDNP3 — Free DNP3 Simulator Walkthrough'),
      yt('Triangle MicroWorks DNP3 simulator free download', 'Triangle MicroWorks Dnp3 Simulator Setup'),
      clarke('Chapter 6: DNP3 Lab and Practical Testing', '248'),
    ],
    level2: [
      yt('Python dnpython DNP3 library tutorial', 'Python DNP3 — Reading Outstation Data Programmatically'),
      yt('Wireshark DNP3 capture filter tcp port 20000', 'Wireshark DNP3 Capture — TCP Port 20000 Filter'),
      doc('OpenDNP3 Documentation', 'https://automatak.github.io/dnp3/'),
      clarke('Chapter 6: End-to-End DNP3 System Validation', '254'),
    ],
  },
}
