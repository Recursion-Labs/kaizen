// stores entities & relationships

export type NodeType = "tab" | "domain" | "pattern" | "behavior";

export interface KnowlegeNode {
    id: string; // unique identifier like tabId or domain name or pattern type
    type: NodeType;
    metadata?: Record<string, any>; // additional info like timestamps, severity etc
}

export interface KnowledgeEdge {
    source: string; // node id of the source node
    target: string; // node id of the target node
    type: string; // relationship type like visited or exhibits or relatedTo
    metadata?: Record<string, any>;
}

export class KnowledgeGraph {
    private nodes: Map<string, KnowlegeNode> = new Map();
    private edges: KnowledgeEdge[] = [];

    addNode (node: KnowlegeNode) {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node); // add a new node only if not exists
        }
    }

    addEdge (edge: KnowledgeEdge) {
        if (this.nodes.has(edge.source) && this.nodes.has(edge.target)) {
            this.edges.push(edge); // add edge only if both nodes exist
        }
    }

    getNode (id: string): KnowlegeNode | undefined {
        return this.nodes.get(id); // retrieve node by id
    }

    getEdgesForNode (id: string): KnowledgeEdge[] {
        return this.edges.filter((e) => e.source === id || e.target === id); // gets all edges connected to a node
    }

    getAllNodes (): KnowlegeNode[] {
        return Array.from(this.nodes.values()); // returns all nodes in the graph
    }

    getAllEdges (): KnowledgeEdge[] {
        return this.edges; // returns all edges in the graph
    }

    removeNode (id: string) { // remove a node and all its edges 
        this.nodes.delete(id); 
        this.edges = this.edges.filter((e) => e.source !== id && e.target !== id); 
    }

    clearGraph () {
        this.nodes.clear();
        this.edges = []; // clears the entire graph including both nodes and edges
    }
}  