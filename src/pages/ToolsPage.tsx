import { tools } from '../utils/tools';

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">All PDF Tools</h1>
        <p className="mt-2 text-slate-400">Choose the tool that matches your workflow.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <div key={tool.key} className="card">
            <div className="text-3xl">{tool.icon}</div>
            <h2 className="mt-4 text-lg font-semibold">{tool.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
            <a href={`#${tool.href}`} className="btn-primary mt-5 inline-flex">Use Tool</a>
          </div>
        ))}
      </div>
    </div>
  );
}
