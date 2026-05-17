import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import AnalogyCard from '../components/AnalogyCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'
import { ANALOGIES } from '../data/chapters'

export default function DataLink() {
  return (
    <ChapterLayout chapterId="datalink" title="Data Link Layer" emoji="🔗" prev="layers" next="appLayer">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The Frame That Lives on the Wire</h2>
        <p>
          The DNP3 Data Link Layer is responsible for getting bytes from point A to point B on a single
          communication segment. It handles <strong>addressing</strong>, <strong>error detection</strong>,
          and <strong>flow control</strong> between two adjacent nodes. It knows nothing about what's
          inside the payload — that's the Transport Layer's problem.
        </p>
        <p className="mt-3">
          Every DNP3 Data Link frame starts with the same two bytes: <strong>0x05 0x64</strong>. Always.
          This is not a coincidence or a tradition — it's a framing requirement. If you don't see 0x05 0x64,
          you don't have a DNP3 frame. If you do, you probably do.
        </p>
      </section>

      {/* Frame diagram */}
      <div className="bg-slate-900/60 rounded-2xl overflow-hidden my-6">
        <div className="text-amber-400 text-xs font-bold px-4 py-2 uppercase tracking-widest border-b border-white/10">
          DNP3 Data Link Frame Structure
        </div>
        <div className="p-4">
          <div className="flex rounded-xl overflow-hidden border border-white/20 text-white text-xs font-mono">
            <div className="frame-field bg-amber-500/100/80 border-r border-white/20">
              <div className="text-amber-400">Start</div>
              <div>0x05 0x64</div>
              <div className="text-white/50">2 bytes</div>
            </div>
            <div className="frame-field bg-amber-500/100/60 border-r border-white/20">
              <div className="text-amber-400">Len</div>
              <div>LEN</div>
              <div className="text-white/50">1 byte</div>
            </div>
            <div className="frame-field bg-amber-500/100/60 border-r border-white/20">
              <div className="text-amber-400">Control</div>
              <div>CTRL</div>
              <div className="text-white/50">1 byte</div>
            </div>
            <div className="frame-field bg-amber-700/50 border-r border-white/20">
              <div className="text-amber-300">Dest</div>
              <div>ADDR</div>
              <div className="text-white/50">2 bytes</div>
            </div>
            <div className="frame-field bg-amber-700/50 border-r border-white/20">
              <div className="text-amber-300">Source</div>
              <div>ADDR</div>
              <div className="text-white/50">2 bytes</div>
            </div>
            <div className="frame-field bg-white/10 border-r border-white/20">
              <div className="text-green-400">CRC</div>
              <div>CRC-16</div>
              <div className="text-white/50">2 bytes</div>
            </div>
            <div className="frame-field bg-slate-600/60 border-r border-white/20">
              <div className="text-amber-400">Data</div>
              <div>Blocks</div>
              <div className="text-white/50">0-250 bytes</div>
            </div>
          </div>
          <div className="text-white/50 text-xs mt-2 text-center">Header = 10 bytes · Data split into 16-byte blocks each with its own 2-byte CRC</div>
        </div>
      </div>

      <Callout type="key" title="The 0x0564 Magic Number">
        Start bytes <strong>0x05 0x64</strong> are the DNP3 frame delimiter. When a receiver is scanning
        a raw byte stream (especially useful after a line error scrambles byte alignment), it looks for
        this sequence to find the start of the next valid frame. Without a fixed start delimiter, a single
        bit error could desynchronize parsing indefinitely.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Addressing: Source and Destination</h2>
        <p>
          DNP3 uses <strong>16-bit addresses</strong> for both source and destination. This gives a range of
          0 to 65535, though the full range isn't available:
        </p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            { range: '0 – 65519', label: '0x0000 – 0xFFEF', desc: 'Valid outstation addresses' },
            { range: '65520 – 65527', label: '0xFFF0 – 0xFFF7', desc: 'Reserved' },
            { range: '65528 – 65534', label: '0xFFF8 – 0xFFFE', desc: 'Reserved for future use' },
            { range: '65535', label: '0xFFFF', desc: 'Broadcast address — all outstations receive, none respond' },
          ].map((r) => (
            <div key={r.range} className="flex items-center gap-4 bg-slate-800/40 rounded-xl px-4 py-3 border border-amber-900/20">
              <span className="font-mono text-xs text-amber-400 min-w-28">{r.label}</span>
              <span className="text-slate-400">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <FunFact index={4} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The Control Byte</h2>
        <p>
          The 1-byte Control field encodes several flags. The most important:
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-xl border border-amber-900/30 p-4 font-mono text-sm">
          <div className="text-slate-400 mb-2">Control byte: [DIR | PRM | FCB | FCV | FC (4 bits)]</div>
          <div className="space-y-2">
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">DIR</span><span className="text-slate-300">Direction bit — 1 = from master, 0 = from outstation</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">PRM</span><span className="text-slate-300">Primary bit — 1 = primary frame (from master), 0 = secondary</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">FCB</span><span className="text-slate-300">Frame Count Bit — alternates 0/1 on successive primary frames for duplicate detection</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">FCV</span><span className="text-slate-300">Frame Count Valid — tells receiver whether to check the FCB</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">FC</span><span className="text-slate-300">Link layer function code — Reset Link (0), Test Link (2), User Data (3), etc.</span></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">CRC-16/DNP — Not Your Father's CRC</h2>
        <p>
          DNP3 uses a specific CRC variant: <strong>CRC-16/DNP</strong>, also known as CRC-ANSI or
          CRC-16-IBM with a specific polynomial and initialization. It is <em>different</em> from CRC-16/Modbus.
        </p>
        <p className="mt-3">
          The polynomial is <code>0x3D65</code> (reflected: <code>0xA6BC</code>). The CRC is calculated on
          the header (bytes 0-7), then separately on each 16-byte data block. Each block has its own 2-byte
          CRC appended. This means a corrupt data block is detected immediately — you don't have to wait for
          the entire frame before finding an error.
        </p>
      </section>

      <Callout type="warning" title="CRC-16/DNP ≠ CRC-16/Modbus">
        Both use 16-bit CRCs but with different polynomials. If you copy a Modbus CRC implementation
        into a DNP3 parser, every single frame will fail CRC validation. The devices won't tell you why.
        They'll just silently discard frames. This mistake has a way of surviving in codebases for years.
      </Callout>

      <AnalogyCard analogy={ANALOGIES[5]} />

      <div className="flex items-start gap-6 my-6">
        <p className="flex-1 text-sm text-slate-400 leading-relaxed">The data link layer transmits one frame at a time — no windowing, no parallel frames. Each frame starts with 0x05 0x64, includes a length byte and two address bytes, and ends with a 16-bit CRC. The primary station controls access to the serial link. Outstations never transmit at the data link level on their own — only the application layer has unsolicited capability.</p>
        <GifCard gifKey="serial" caption="Bytes flowing down the serial link ⚡" />
      </div>

      <FunFact index={5} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.datalink} />
      <QuizLevels chapterId="datalink" />
    </ChapterLayout>
  )
}
