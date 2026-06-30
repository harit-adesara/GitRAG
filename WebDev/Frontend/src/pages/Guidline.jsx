export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">GitRAG Guide</h1>

        <p className="text-[#8b8b9b] mt-3">
          Learn how GitRAG works, its strengths, and its current limitations.
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          How GitRAG Works
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-[#c7c7d1]">
          <li>Add a GitHub repository using its clone URL.</li>

          <li>GitRAG downloads and analyzes the repository files.</li>

          <li>The repository is split into smaller code chunks.</li>

          <li>Embeddings are generated for every chunk.</li>

          <li>Embeddings are stored inside a vector database.</li>

          <li>
            When you ask a question, the most relevant code chunks are
            retrieved.
          </li>

          <li>Retrieved context is provided to the AI model.</li>

          <li>
            The AI generates an answer based on the repository's codebase.
          </li>
        </ul>
      </div>

      {/* Strengths */}
      <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          What GitRAG Is Good At
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-[#c7c7d1]">
          <li>Explaining existing code.</li>

          <li>Understanding repository architecture.</li>

          <li>Explaining authentication and authorization flows.</li>

          <li>Locating where features are implemented.</li>

          <li>Understanding APIs, controllers, services, and utilities.</li>

          <li>Summarizing repositories and modules.</li>

          <li>Helping developers onboard faster.</li>

          <li>Answering repository-specific questions.</li>

          <li>Understanding relationships between files and components.</li>
        </ul>
      </div>

      {/* Limitations */}
      <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Current Limitations
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-[#c7c7d1]">
          <li>
            GitRAG is primarily designed for repository understanding and
            explanation.
          </li>

          <li>
            It performs best when answering questions about existing code.
          </li>

          <li>
            While it can generate code suggestions, code generation is not its
            primary strength.
          </li>

          <li>Generated code may require manual review and modifications.</li>

          <li>Large repositories may take additional time to process.</li>

          <li>AI responses should always be verified before production use.</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-violet-300 mb-4">
          Recommended Usage
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-[#c7c7d1]">
          <li>Use GitRAG to understand unfamiliar repositories.</li>

          <li>
            Ask architecture and implementation questions before making changes.
          </li>

          <li>Use explanations to speed up debugging and onboarding.</li>

          <li>
            Review generated code before integrating it into your project.
          </li>

          <li>
            Treat GitRAG as a repository assistant rather than a full
            code-generation tool.
          </li>
        </ul>
      </div>
    </div>
  );
}
