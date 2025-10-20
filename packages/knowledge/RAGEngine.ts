// retrieval + context builder for AI

import { KnowledgeGraph, KnowlegeNode } from "./KnowledgeGraph";

export class RAGEngine {
    private KG: KnowledgeGraph;

    constructor (kG: KnowledgeGraph) {
        this.KG = kG;
    }

    retriveBehaviorContext (behaviorType: string): KnowlegeNode[] {
        return this.KG.getAllNodes().filter((node) => node.type === "behavior" && node.id.includes(behaviorType)); // retrive all nodes of a specific behaviour type
    }

    retriveRecentPatterns (limit: number = 10): KnowlegeNode[] {
        const patterns = this.KG.getAllNodes().filter((n) => n.type === "pattern");
        return patterns.slice(-limit); // retrive recent patterns for AI reasoning or nudging context
    }

    generateContextForNudge(): Record<string, any> {
        return {
            behaviors: this.retriveBehaviorContext("doomscrolling").map((b) => ({ id: b.id, metadata: b.metadata})),
            patterns: this.retriveRecentPatterns().map((p) => ({ id: p.id, metadata: p.metadata})),
            timeStamp: Date.now(),
        }; // generate a structured context object for downstream processing
    }

    getFullGraph() {
        return {
            nodes: this.KG.getAllNodes(),
            edges: this.KG.getAllEdges(),
        }; // will retrive the entire knowledge graph for visualization or AI refference
    }
}