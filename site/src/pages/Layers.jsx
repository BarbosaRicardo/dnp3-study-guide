import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function Layers() {
  return (
    <ChapterLayout chapterId="layers" title="Protocol Layers" emoji="🧱" prev="intro" next="datalink">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The DNP3 Pseudo-OSI Stack</h2>
        <p>
          DNP3 defines a <strong>4-layer stack</strong> loosely based on the OSI model, but don't get too excited —
          it's not a full OSI implementation. DNP3 skips layers 5 and 6 entirely (Presentation and Session)
          because whoever wrote the spec decided they weren't needed. They were mostly right.
        </p>
        <p className="mt-3">
          The four layers are: <strong>Physical</strong>, <strong>Data Link</strong>, <strong>Transport</strong>,
          and <strong>Application</strong>. Each layer wraps the layer above it, and each adds its own header and
          (sometimes) footer. By the time a simple "read Binary Input" request hits the wire, it has been
          wrapped three times like a protocol burrito.
        </p>
      </section>

      {/* Layer diagram */}
      <div className="bg-slate-800/30 rounded-2xl border border-amber-900/30 overflow-hidden my-6">
        <div className="bg-slate-900/60 text-white text-xs font-bold px-4 py-2 uppercase tracking-widest">DNP3 Protocol Stack</div>
        <div className="p-4 space-y-2">
          {[
            { layer: 'Application Layer (Layer 4)', abbr: 'APDU', color: 'bg-amber-500/100', desc: 'Function codes, data objects, IIN bits, fragmentation' },
            { layer: 'Transport Layer (Layer 3)',   abbr: 'TPDU', color: 'bg-amber-700',  desc: 'FIR/FIN bits, sequence numbers, reassembly' },
            { layer: 'Data Link Layer (Layer 2)',   abbr: 'LPDU', color: 'bg-green-700', desc: '0x0564 start, addresses, CRC-16/DNP, direction bit' },
            { layer: 'Physical Layer (Layer 1)',    abbr: 'PHY',  color: 'bg-slate-600',  desc: 'RS-232, RS-485 serial or TCP/IP (port 20000)' },
          ].map((l) => (
            <div key={l.layer} className="flex items-center gap-4 rounded-xl border border-amber-900/30 p-3" style={{ background: 'rgba(245,158,11,0.04)' }}>
              <div className={`${l.color} text-white text-xs font-bold px-3 py-2 rounded-lg w-16 text-center flex-shrink-0`}>
                {l.abbr}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-amber-400 text-sm">{l.layer}</div>
                <div className="text-xs text-slate-400 mt-0.5">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 text-xs text-slate-500 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          ↑ User data flows down through layers; responses flow back up
        </div>
      </div>

      <Callout type="key" title="Layers Wrap Each Other">
        An Application Layer request (APDU) gets handed to Transport, which adds a 1-byte header creating
        a TPDU. That TPDU (or chunk of it) gets handed to Data Link, which adds a 10-byte header, splits
        into 16-byte blocks, appends CRCs, and creates an LPDU. The LPDU goes out the serial port.
        On receive, the process reverses. Each layer only sees its own header and payload.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Physical Layer</h2>
        <p>
          DNP3 runs over multiple physical media. The original target was slow, long-distance serial links
          common in utility SCADA — leased telephone lines running at 1200 baud connecting substations
          50 miles away.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { medium: 'RS-232 / RS-485', port: 'Serial COM port', speed: '300 – 115200 baud', note: 'Legacy RTUs, direct connections' },
            { medium: 'TCP/IP',          port: 'Port 20000',      speed: 'Full Ethernet',     note: 'Modern deployments, WAN tunnels' },
            { medium: 'UDP/IP',          port: 'Port 20000',      speed: 'Full Ethernet',     note: 'Less common, reduced overhead' },
          ].map((m) => (
            <div key={m.medium} className="bg-slate-800/40 border border-amber-900/30 rounded-xl p-4">
              <div className="font-semibold text-amber-400">{m.medium}</div>
              <div className="text-xs text-slate-400 mt-1">Port / Interface: <span className="font-mono">{m.port}</span></div>
              <div className="text-xs text-slate-500">Speed: {m.speed}</div>
              <div className="text-xs text-slate-400 mt-2 italic">{m.note}</div>
            </div>
          ))}
        </div>
      </section>

      <FunFact index={2} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Transport Layer — The Forgotten Layer</h2>
        <p>
          The Transport Layer exists for one reason: Application Layer messages can be <strong>larger than
          a single Data Link frame</strong>. The Data Link Layer has a maximum data payload of 250 bytes.
          A response containing hundreds of analog values can easily exceed that.
        </p>
        <p className="mt-3">
          The Transport Layer takes the Application Layer PDU and chops it into chunks. Each chunk gets
          a 1-byte Transport Header with two flags:
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-xl border border-amber-900/30 p-4 font-mono text-sm">
          <div className="text-slate-400 mb-2">Transport Header byte: [FIR | FIN | Seq (6 bits)]</div>
          <div className="space-y-2">
            <div className="flex gap-3"><span className="text-amber-400 font-bold">FIR</span><span className="text-slate-300">= First fragment (bit 6) — this is the first transport segment</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold">FIN</span><span className="text-slate-300">= Final fragment (bit 7) — this is the last transport segment</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold">Seq</span><span className="text-slate-300">= Sequence number (bits 0-5) — 0 to 63, wraps around</span></div>
          </div>
          <div className="mt-3 text-slate-400 text-xs">
            Single-fragment message: FIR=1, FIN=1 (both set — first and last)<br />
            First of multi-fragment: FIR=1, FIN=0<br />
            Middle fragment: FIR=0, FIN=0<br />
            Last fragment: FIR=0, FIN=1
          </div>
        </div>
      </section>

      <Callout type="field" title="Field Gotcha: Sequence Number Mismatch">
        If the master and outstation disagree on transport sequence numbers (usually after a reset or
        communication gap), the outstation will silently discard all messages until the sequence syncs up.
        Your polls time out. Your logs show nothing useful. The fix: reset the link layer, which resets
        sequences. If you don't know about this, you'll be on-site for hours.
      </Callout>

      <GifCard gifKey="cables" caption="Protocol layers, visualized" side="right"
        body="DNP3 implements three explicit layers: Data Link (framing, addressing, CRC), Pseudo-Transport (segmentation and reassembly), and Application (function codes, objects, IIN flags). Each adds its own header and integrity check. A CRC failure at the Data Link layer discards the frame before the transport layer ever sees it — layered error detection means failures are caught at the lowest possible level."
      />

      <FunFact index={3} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.layers} />
      <QuizLevels chapterId="layers" />
    </ChapterLayout>
  )
}
