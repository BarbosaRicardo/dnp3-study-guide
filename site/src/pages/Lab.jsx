import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import CodeLab from '../components/CodeLab'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'
import { DNP3_LAB } from '../data/labExercises'

const TOOLS = [
  {
    name: 'OpenDNP3',
    type: 'Open Source Library',
    url: 'https://automatak.github.io/dnp3/',
    desc: 'C++ DNP3 library by Automatak. The gold standard for open-source DNP3. Full SA v5 support. Used in everything from academic research to production SCADA.',
    cost: 'Free (Apache 2.0)',
  },
  {
    name: 'Triangle MicroWorks Test Harness',
    type: 'Commercial Test Tool',
    url: 'https://www.trianglemicroworks.com/products/testing-tools/dnp3-test-harness',
    desc: 'The industry standard for DNP3 interoperability testing. If your device passes TMW testing, it works. If it doesn\'t, vendors fix it. Required for most utility acceptance testing.',
    cost: 'Commercial — budget accordingly',
  },
  {
    name: 'Triangle MicroWorks SCADA Data Gateway',
    type: 'Commercial Gateway',
    url: 'https://www.trianglemicroworks.com/products/scada-data-gateway',
    desc: 'Protocol converter that speaks DNP3, Modbus, IEC 60870-5, and more. Widely deployed at utilities for legacy integration. Runs on Windows.',
    cost: 'Commercial',
  },
  {
    name: 'dnp3 Python Library (pydnp3/dnpython)',
    type: 'Python Library',
    url: 'https://github.com/ChargePoint/pydnp3',
    desc: 'Python bindings for OpenDNP3. Lets you write a DNP3 master or outstation in pure Python. Great for testing, scripting, and academic work. Not for production SCADA.',
    cost: 'Free',
  },
  {
    name: 'Wireshark with DNP3 Dissector',
    type: 'Packet Analyzer',
    url: 'https://www.wireshark.org',
    desc: 'Wireshark decodes DNP3 out of the box. For TCP DNP3 (port 20000), just capture and filter. For serial DNP3, you need a serial capture device (FTDI adapter or protocol analyzer).',
    cost: 'Free',
  },
  {
    name: 'GE MDS Orbit / ABB RTU500',
    type: 'Real Hardware (Reference)',
    url: 'https://www.ge.com/digital/applications/scada',
    desc: 'Common utility RTUs that speak DNP3. If you can get your hands on one for a lab bench, do it. Real hardware reveals edge cases that simulators hide. Ask your employer.',
    cost: 'Hardware cost',
  },
]

export default function Lab() {
  return (
    <ChapterLayout chapterId="lab" title="DNP3 Lab & Practice" emoji="🧪" prev="troubleshoot">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Getting Your Hands Dirty</h2>
        <p>
          Reading about DNP3 is useful. Actually building a master, watching it poll an outstation,
          and seeing the event buffers fill up in real time is where it becomes permanent knowledge.
          The tools below will get you from zero to a working DNP3 lab environment without spending
          money you don't have.
        </p>
        <p className="mt-3">
          DNP3 was designed by utilities, so the open-source ecosystem is smaller than Modbus —
          but it exists. OpenDNP3 is the real deal, and you can have a simulated master/outstation
          exchange running on your laptop in under an hour.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-4">Tools and Simulators</h2>
        <div className="space-y-3">
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-800/40 border border-amber-900/30 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-amber-400 group-hover:text-amber-400 transition-colors">{tool.name}</span>
                    <span className="text-xs bg-amber-900/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">{tool.type}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{tool.desc}</p>
                  <div className="mt-2 text-xs text-slate-400 font-medium">{tool.cost}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <FunFact index={9} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Lab Exercise 1: OpenDNP3 Master/Outstation</h2>
        <p>
          OpenDNP3 ships with demo programs. Here's the fastest path to a working DNP3 exchange on localhost:
        </p>
        <div className="mt-4 bg-navy-700 text-green-400 rounded-xl p-4 font-mono text-xs space-y-1">
          <div className="text-slate-400"># Install OpenDNP3 via package manager or build from source</div>
          <div>git clone https://github.com/automatak/dnp3.git</div>
          <div>cd dnp3 && mkdir build && cd build</div>
          <div>cmake .. -DDEMO=ON</div>
          <div>make -j4</div>
          <div className="mt-2 text-slate-400"># Run the outstation demo (listens on 127.0.0.1:20000)</div>
          <div>./outstation-demo</div>
          <div className="mt-2 text-slate-400"># In a second terminal, run the master demo</div>
          <div>./master-demo</div>
          <div className="mt-2 text-slate-400"># Watch the console — you'll see polls, responses, and events</div>
          <div className="text-amber-400"># Capture it in Wireshark (filter: tcp.port == 20000)</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Lab Exercise 2: Python DNP3 Master</h2>
        <p>
          The pydnp3 library wraps OpenDNP3 for Python. A minimal master that reads Binary Input
          Group 1 from a running outstation looks like this:
        </p>
        <div className="mt-4 bg-navy-700 text-green-400 rounded-xl p-4 font-mono text-xs space-y-0.5">
          <div className="text-slate-400"># pip install pydnp3</div>
          <div>from pydnp3 import opendnp3, openpal, asiopal, asiodnp3</div>
          <div className="mt-2 text-slate-400"># Create master stack</div>
          <div>manager = asiodnp3.DNP3Manager(1)</div>
          <div>channel = manager.AddTCPClient("client", opendnp3.levels.NORMAL,</div>
          <div>    asiopal.ChannelRetry.Default(), "127.0.0.1", 20000)</div>
          <div className="mt-2 text-slate-400"># Add a master to the channel</div>
          <div>master = channel.AddMaster("master", MySOEHandler(),</div>
          <div>    asiodnp3.DefaultMasterApplication.Create(),</div>
          <div>    opendnp3.MasterStackConfig())</div>
          <div className="mt-2 text-slate-400"># Enable it — starts communicating</div>
          <div>master.Enable()</div>
          <div className="mt-2 text-amber-400"># MySOEHandler() is where you receive the data</div>
          <div className="text-amber-400"># Implement process_binary(), process_analog(), etc.</div>
        </div>
      </section>

      <Callout type="pro" title="Wireshark Capture Filter for DNP3">
        For any lab work or field troubleshooting: always run Wireshark in the background.
        Filter: <code>tcp.port == 20000</code> for TCP DNP3. Save the .pcap file before
        changing any configuration. You will want that capture later when something breaks.
        Future you will thank present you.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Lab Checklist: Minimum Competency</h2>
        <div className="space-y-2">
          {[
            'Run a DNP3 outstation simulator and connect a master to it',
            'Capture the startup exchange in Wireshark and decode each frame type',
            'Identify the IIN bits in a response — all 16 of them',
            'Enable and disable unsolicited responses and observe the difference',
            'Trigger an event (binary input change) and watch it flow from event buffer to master',
            'Decode a DNP3 object header: Group, Variation, Qualifier, Range',
            'Perform a Select-Before-Operate and observe both request/response pairs',
            'Force an event buffer overflow and observe IIN2.3 being set',
            'Sync time on an outstation using Group 50 Variation 1',
            'Read a device profile document and configure the master poll schedule from it',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800/40 rounded-xl px-4 py-3 border border-amber-900/20">
              <div className="w-5 h-5 border-2 border-mblue-300 rounded flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <GifCard gifKey="celebrate" caption="You made it through DNP3! That's real utility SCADA knowledge 🎉" side="right" />

      <FunFact index={11} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.lab} />

      <CodeLab exercises={DNP3_LAB} />

      <QuizLevels chapterId="lab" />
    </ChapterLayout>
  )
}
