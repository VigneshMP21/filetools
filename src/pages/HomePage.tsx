import { tools } from '../utils/tools';

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Private • Fast • No login required</span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">All Your Essential PDF Tools in One Place</h1>
          <p className="max-w-2xl text-lg text-slate-300">Merge, split, compress, convert and manage PDF files quickly and securely.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#/tools" className="btn-primary">Explore PDF Tools</a>
            <a href="#/privacy" className="btn-secondary">Learn About Privacy</a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Select a tool and upload your files.</li>
            <li>• Process the document in seconds.</li>
            <li>• Download the result and leave—files are deleted automatically.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Popular PDF Tools</h2>
            <p className="text-slate-400">Choose a tool and get started instantly.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.key} className="card transition hover:-translate-y-1">
              <div className="text-3xl">{tool.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
              <a href={`#${tool.href}`} className="btn-primary mt-5 inline-flex">Open Tool</a>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold">Temporary Storage</h3>
            <p className="mt-2 text-sm text-slate-400">Files are stored only while they are being processed.</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Automatic Deletion</h3>
            <p className="mt-2 text-sm text-slate-400">Uploaded and generated files are deleted automatically.</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">No Registration</h3>
            <p className="mt-2 text-sm text-slate-400">Use every tool without creating an account.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
