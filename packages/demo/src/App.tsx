import { useState } from 'react';
import Demo from './pages/Demo';
import Examples from './pages/Examples';

type Tab = 'demo' | 'examples';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('demo');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-aqua-blue-500 to-aqua-blue-700 rounded-lg"></div>
                <span className="text-xl font-bold text-pool-deck-800">
                  React 3D Model Viewer
                </span>
              </div>
              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'demo'
                      ? 'bg-aqua-blue-100 text-aqua-blue-700'
                      : 'text-pool-deck-600 hover:bg-gray-100'
                  }`}
                >
                  Interactive Demo
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'examples'
                      ? 'bg-aqua-blue-100 text-aqua-blue-700'
                      : 'text-pool-deck-600 hover:bg-gray-100'
                  }`}
                >
                  Code Examples
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/yourusername/react-3d-model-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pool-deck-600 hover:text-aqua-blue-600 transition-colors"
                title="View on GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/react-3d-model-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-4 py-2 bg-aqua-blue-500 text-white rounded-md hover:bg-aqua-blue-600 transition-colors font-medium text-sm"
              >
                npm install
              </a>
            </div>
          </div>

          {/* Mobile tab navigation */}
          <div className="md:hidden border-t border-gray-200 flex">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'demo'
                  ? 'text-aqua-blue-600 border-b-2 border-aqua-blue-600'
                  : 'text-pool-deck-600'
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'examples'
                  ? 'text-aqua-blue-600 border-b-2 border-aqua-blue-600'
                  : 'text-pool-deck-600'
              }`}
            >
              Examples
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section - Always visible */}
      <section className="bg-gradient-to-br from-aqua-blue-50 to-pool-deck-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-pool-deck-900 mb-4">
              React 3D Model Viewer
            </h1>
            <p className="text-lg md:text-xl text-pool-deck-600 mb-6 max-w-3xl mx-auto">
              A modular React component library for visualizing 3D models with Three.js.
              Supports STL, OBJ, GLTF/GLB, FBX, DAE, and 3DS formats.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <div className="bg-pool-deck-900 rounded-lg px-4 py-2 inline-block">
                <code className="text-green-400 font-mono text-sm">
                  npm install react-3d-model-viewer
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Tabbed */}
      <main className="pb-16">
        {activeTab === 'demo' && <Demo />}
        {activeTab === 'examples' && <Examples />}
      </main>

      {/* Features Section - Always visible */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-pool-deck-900 mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                Material Controls
              </h3>
              <p className="text-sm text-pool-deck-600">
                Customize materials with Standard, Phong, Lambert, Basic, and Wireframe options.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                Lighting System
              </h3>
              <p className="text-sm text-pool-deck-600">
                Configure ambient, directional lights with multiple environment presets.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                Transform Controls
              </h3>
              <p className="text-sm text-pool-deck-600">
                Translate, rotate, and scale models interactively with visual gizmos.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-pool-deck-600">
                Supports STL, OBJ, GLTF/GLB, FBX, DAE, 3DS, and ZIP packages.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">🧩</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                Modular Architecture
              </h3>
              <p className="text-sm text-pool-deck-600">
                Import only what you need. Tree-shakeable exports for minimal bundle size.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-pool-deck-800 mb-2">
                TypeScript Support
              </h3>
              <p className="text-sm text-pool-deck-600">
                Fully typed with comprehensive definitions for excellent IDE support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-pool-deck-500 text-sm">
            <p>Built with React, Three.js, and ❤️</p>
            <p className="mt-2">
              <a
                href="https://github.com/yourusername/react-3d-model-viewer"
                className="text-aqua-blue-600 hover:text-aqua-blue-700"
              >
                View on GitHub
              </a>
              {' • '}
              <a
                href="https://www.npmjs.com/package/react-3d-model-viewer"
                className="text-aqua-blue-600 hover:text-aqua-blue-700"
              >
                View on npm
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
