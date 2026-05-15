export const CHAPTERS = [
  { id: 'home',        label: 'Home',                        icon: 'Home', path: '/' },
  { id: 'intro',       label: 'Ch 1: DNP3 Overview',         icon: 'Radio', path: '/intro' },
  { id: 'layers',      label: 'Ch 2: Protocol Layers',       icon: 'Layers', path: '/layers' },
  { id: 'datalink',    label: 'Ch 3: Data Link Layer',       icon: 'Link', path: '/datalink' },
  { id: 'appLayer',    label: 'Ch 4: Application Layer',     icon: 'Package', path: '/appLayer' },
  { id: 'objects',     label: 'Ch 5: Data Objects & Groups', icon: 'FolderTree', path: '/objects' },
  { id: 'fc',          label: 'Ch 6: Function Codes',        icon: 'Settings', path: '/fc' },
  { id: 'unsol',       label: 'Ch 7: Unsolicited Responses', icon: 'Bell', path: '/unsol' },
  { id: 'security',    label: 'Ch 8: Secure Authentication', icon: 'Shield', path: '/security' },
  { id: 'troubleshoot',label: 'Ch 9: Troubleshooting',       icon: 'Wrench', path: '/troubleshoot' },
  { id: 'lab',         label: 'Ch 10: Lab & Practice',       icon: 'FlaskConical', path: '/lab' },
]

export const FUN_FACTS = [
  { text: "DNP3 was designed in the early 1990s by Westronic Inc. for electric utilities in North America. It was based on IEC 60870-5, a European standard, because apparently even protocol designers steal good ideas from Europe.", icon: "Globe" },
  { text: "The 'D' in DNP3 stands for 'Distributed.' DNP3's full name is Distributed Network Protocol. The '3' is because versions 1 and 2 were internal drafts that never shipped publicly. Classic engineers: ship version 3 first, document versions 1 and 2 never.", icon: "Hash" },
  { text: "DNP3's CRC is CRC-16/DNP — a specific polynomial variant that is DIFFERENT from CRC-16/Modbus. If you accidentally use the Modbus CRC implementation for DNP3, every single frame will be rejected. The devices will say nothing. You will lose your mind.", icon: "AlertOctagon" },
  { text: "DNP3 start bytes are always 0x05 0x64. There is no other valid start sequence. If you're sniffing traffic and see these two bytes, you found a DNP3 frame. It's like the protocol shouts 'HERE I AM' in hex at the start of every message.", icon: "Megaphone" },
  { text: "DNP3 supports up to 65519 outstation addresses (0 to 0xFFF9). Modbus tops out at 247 slaves. DNP3 was built for large utility networks where a single master might poll hundreds of RTUs stretched across a state. No wonder it needs 16-bit addressing.", icon: "Map" },
  { text: "An engineer at a water utility once spent two days debugging DNP3 comms before discovering the master had Secure Authentication v2 enabled and the RTU only supported SA v5. They're not backward compatible. The devices were speaking two different security dialects and silently failing. Two. Days.", icon: "Droplets" },
  { text: "DNP3 Class 0 is the 'static' snapshot — current values, no timestamps. Classes 1, 2, and 3 are event buffers sorted by priority. If your Class 1 buffer fills up and you don't poll fast enough, the oldest events are dropped. Your substation just quietly forgot that breaker tripped.", icon: "Trash2" },
  { text: "DNP3 has a built-in 'confirm' mechanism where the master must ACK unsolicited messages. If it doesn't ACK, the outstation retries. Forever. Misconfigure your unsolicited response settings and you'll get a device that spams the link every 5 seconds until the end of time.", icon: "RefreshCw" },
  { text: "Wireshark has had a DNP3 dissector since version 1.4. This means you can capture raw bytes, load them in Wireshark, and watch it decode every Group, Variation, Function Code, and CRC in real time. This is how you find out your vendor's 'firmware update' silently changed the object map.", icon: "Terminal" },
  { text: "The Triangle MicroWorks DNP3 test harness is the industry gold standard for interoperability testing. If your outstation doesn't work with TMW, it doesn't work. Period. Every serious DNP3 implementation gets tested against it. Budget accordingly.", icon: "Ruler" },
  { text: "DNP3 timestamps are 48-bit millisecond UTC values. A 48-bit counter can represent dates until the year 10889. Whoever designed DNP3 was not going to be caught in a Y2K situation again. Reasonable, honestly.", icon: "Clock" },
  { text: "IEC 61968/61970 (CIM) and DNP3 overlap in utility SCADA. Some utilities run both: DNP3 for field device comms, CIM for EMS/SCADA data models. If your job posting says 'DNP3 AND CIM experience,' double your asking salary.", icon: "DollarSign" },
]

export const ANALOGIES = [
  {
    title: "The Newspaper Delivery Model",
    concept: "Unsolicited Responses vs. Polling",
    analogy: "Old-school Modbus is like calling the newspaper every morning to ask if there's any news. DNP3 unsolicited responses are like having the newspaper thrown at your door when news happens.\n\nWith **polling**, the master asks each device: 'Anything new?' one at a time. With **unsolicited responses**, the outstation says 'HEY, something changed!' as soon as it happens — without being asked.\n\nFor a utility monitoring 500 substations, polling all of them fast enough to catch real-time events is physically impossible. Unsolicited responses solve this. The substation tells YOU when the breaker trips, not after you finally get around to asking.",
    gif: 'nerd'
  },
  {
    title: "The Hospital Triage System",
    concept: "DNP3 Event Classes (Class 1/2/3)",
    analogy: "DNP3 events are triaged like ER patients.\n\n**Class 1** = Critical (chest pain, stroke) — poll this first, always.\n**Class 2** = Urgent (broken arm, high fever) — poll next.\n**Class 3** = Less urgent (sprained ankle, mild burn) — poll when you have time.\n\nThe outstation keeps three separate waiting rooms. You, the master, check Class 1 patients first every poll cycle. If you skip Class 1 for too long, the oldest patients quietly leave through the back door (events are dropped). The device doesn't complain. It just loses the event. Your historian never knows that breaker tripped.",
    gif: 'warning'
  },
  {
    title: "The FedEx Tracking Number",
    concept: "DNP3 Application Layer Fragmentation",
    analogy: "A DNP3 Application Layer response can be huge — hundreds of data objects. But the Data Link Layer has a maximum frame size (282 bytes). So large responses get **fragmented** into multiple transport frames and then multiple data link frames.\n\nIt's like shipping a couch. The store (outstation) can't fit the whole couch in one FedEx box. So it ships 4 boxes (application fragments), each split across multiple postal packages (data link frames). You (the master) reassemble them in order. Drop a box, and you wait for a retransmit.\n\n**The FIN bit** on the last application fragment is your 'last box delivered' notification.",
    gif: 'cables'
  },
  {
    title: "The Combination Lock with a Handshake",
    concept: "DNP3 Select-Before-Operate (SBO)",
    analogy: "You want to open a breaker. Sounds simple. DNP3 says: not so fast.\n\n**Select-Before-Operate** is a two-step safety mechanism:\n1. **Select** — 'I intend to open Breaker 3.' The outstation says 'OK, I'm ready, don't do anything else for 10 seconds.'\n2. **Operate** — 'Open Breaker 3 now.' The outstation executes.\n\nIf the Select and Operate don't match exactly, or the timer expires, the operate is rejected. This exists because a mis-wired control point once opened the wrong breaker at a substation. Two-step confirmation means a bit flip or a race condition can't accidentally de-energize a neighborhood. A small inconvenience that prevents catastrophic failures.",
    gif: 'checkmark'
  },
  {
    title: "The IIN Bits = Dashboard Warning Lights",
    concept: "Internal Indications (IIN Bits)",
    analogy: "Every DNP3 response contains **IIN bits** — 16 flags reporting the outstation's health.\n\nIIN1.0 = Broadcast message received\nIIN1.6 = Device restart — like the 'check engine' light. The device JUST rebooted. Anything could have changed.\nIIN1.7 = Need time synchronization — like your car clock blinking 12:00 after a battery swap.\nIIN2.0 = Class 1 events available — there's unread mail in the high-priority inbox.\n\nA good master reads IIN bits on EVERY response. A lazy master ignores them. Guess which one calls support at 2 AM because 'the RTU is acting weird and restarted 47 times in the last hour but we didn't know.'",
    gif: 'error'
  },
  {
    title: "The 0x0564 Secret Handshake",
    concept: "DNP3 Start Bytes",
    analogy: "Every DNP3 frame starts with the same two bytes: **0x05 0x64**. Always. Without exception.\n\nIt's the protocol's secret handshake. If you're parsing a byte stream looking for DNP3 frames, you scan for 0x05 followed immediately by 0x64. That's your frame boundary.\n\nWhy these specific bytes? Because 0x05 0x64 is an unlikely pattern in non-DNP3 noise. If you see random RS-485 garbage from EMI, the odds of it starting with exactly 0x05 0x64 followed by a valid CRC are astronomically low.\n\nSo 0x05 0x64 doesn't mean anything semantically. It just means: 'I am DNP3. Pay attention.' Like a coworker who clears their throat before speaking. Every. Single. Time.",
    gif: 'serial'
  },
]
