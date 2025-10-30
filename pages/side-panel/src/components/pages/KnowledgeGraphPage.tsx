import React, { useState, useEffect, useRef } from 'react';

interface GraphNode {
  id: string;
  type: 'domain' | 'behavior' | 'pattern' | 'tab';
  label: string;
  x: number;
  y: number;
  metadata?: any;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight?: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const KnowledgeGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const WIDTH = 800;
  const HEIGHT = 600;

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_KNOWLEDGE_GRAPH',
      });

      if (response.success && response.graph) {
        const transformed = transformGraphData(response.graph);
        setGraphData(transformed);
      }
    } catch (error) {
      console.error('Failed to load knowledge graph:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformGraphData = (rawGraph: any): GraphData => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Extract nodes
    if (rawGraph.nodes) {
      Object.values(rawGraph.nodes).forEach((node: any, index: number) => {
        // Simple circular layout
        const angle = (index / Object.keys(rawGraph.nodes).length) * 2 * Math.PI;
        const radius = Math.min(WIDTH, HEIGHT) * 0.35;
        
        nodes.push({
          id: node.id,
          type: node.type || 'domain',
          label: getNodeLabel(node),
          x: WIDTH / 2 + radius * Math.cos(angle),
          y: HEIGHT / 2 + radius * Math.sin(angle),
          metadata: node.metadata,
        });
      });
    }

    // Extract edges
    if (rawGraph.edges) {
      Object.values(rawGraph.edges).forEach((edge: any) => {
        edges.push({
          source: edge.source,
          target: edge.target,
          type: edge.type || 'relates',
          weight: edge.weight || 1,
        });
      });
    }

    return { nodes, edges };
  };

  const getNodeLabel = (node: any): string => {
    if (node.metadata?.domain) return node.metadata.domain;
    if (node.metadata?.type) return node.metadata.type;
    if (node.id) {
      const parts = node.id.split('-');
      return parts[parts.length - 1] || node.id;
    }
    return 'Unknown';
  };

  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      domain: '#6366f1', // indigo
      behavior: '#ef4444', // red
      pattern: '#f59e0b', // amber
      tab: '#10b981', // green
    };
    return colors[type] || '#9ca3af'; // gray
  };

  const getNodeSize = (type: string): number => {
    const sizes: Record<string, number> = {
      domain: 12,
      behavior: 10,
      pattern: 14,
      tab: 8,
    };
    return sizes[type] || 10;
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const getConnectedNodes = (nodeId: string): string[] => {
    const connected = new Set<string>();
    graphData.edges.forEach(edge => {
      if (edge.source === nodeId) connected.add(edge.target);
      if (edge.target === nodeId) connected.add(edge.source);
    });
    return Array.from(connected);
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    if (!hoveredNode && !selectedNode) return false;
    const targetId = hoveredNode || selectedNode?.id;
    if (nodeId === targetId) return true;
    return getConnectedNodes(targetId!).includes(nodeId);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Graph</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visual representation of your browsing patterns and relationships
          </p>
        </div>
        <button
          onClick={loadGraphData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Nodes', value: graphData.nodes.length, icon: '🔵' },
          { label: 'Connections', value: graphData.edges.length, icon: '🔗' },
          { label: 'Domains', value: graphData.nodes.filter(n => n.type === 'domain').length, icon: '🌐' },
          { label: 'Patterns', value: graphData.nodes.filter(n => n.type === 'pattern').length, icon: '📊' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Graph Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: HEIGHT }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🕸️</div>
            <p className="text-gray-500 dark:text-gray-400">
              No graph data yet. Start browsing to build your knowledge graph!
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
            <svg
              ref={svgRef}
              width="100%"
              height={HEIGHT}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="w-full"
            >
              {/* Define gradients and markers */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#9ca3af"
                    opacity="0.6"
                  />
                </marker>
              </defs>

              {/* Draw edges */}
              <g className="edges">
                {graphData.edges.map((edge, index) => {
                  const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                  const targetNode = graphData.nodes.find(n => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;

                  const isHighlighted = 
                    isNodeHighlighted(edge.source) && isNodeHighlighted(edge.target);

                  return (
                    <line
                      key={`edge-${index}`}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighlighted ? '#6366f1' : '#9ca3af'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeOpacity={isHighlighted ? 0.8 : 0.3}
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
              </g>

              {/* Draw nodes */}
              <g className="nodes">
                {graphData.nodes.map((node) => {
                  const isHighlighted = isNodeHighlighted(node.id);
                  const isSelected = selectedNode?.id === node.id;
                  const size = getNodeSize(node.type);

                  return (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => handleNodeClick(node)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? size + 4 : isHighlighted ? size + 2 : size}
                        fill={getNodeColor(node.type)}
                        fillOpacity={isHighlighted || isSelected ? 1 : 0.7}
                        stroke={isSelected ? '#fbbf24' : 'white'}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      
                      {/* Node label */}
                      {(isHighlighted || isSelected) && (
                        <text
                          x={node.x}
                          y={node.y - size - 8}
                          textAnchor="middle"
                          fontSize="12"
                          fill="currentColor"
                          className="text-gray-900 dark:text-white font-medium"
                        >
                          {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-indigo-200 dark:border-gray-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Node Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getNodeColor(selectedNode.type) + '20',
                      color: getNodeColor(selectedNode.type),
                    }}
                  >
                    {selectedNode.type}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Label:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedNode.label}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {getConnectedNodes(selectedNode.id).length}
                  </span>
                </div>
                {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Metadata:</span>
                    <pre className="mt-1 text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(selectedNode.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'domain', label: 'Domains', description: 'Websites you visited' },
            { type: 'behavior', label: 'Behaviors', description: 'Detected patterns' },
            { type: 'pattern', label: 'Patterns', description: 'Recurring insights' },
            { type: 'tab', label: 'Tabs', description: 'Browser tabs' },
          ].map((item) => (
            <div key={item.type} className="flex items-start gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: getNodeColor(item.type) }}
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          💡 Click on a node to see details. Hover to highlight connections.
        </p>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;
