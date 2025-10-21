import { showAIFloatingBubble } from "../../components/AIFloatingBubble";
import { AIOverlayManager } from "../../services/AIOverlayManager";
import { SearchEnhancer } from "../../services/SearchEnhancer";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("[Kaizen] Content-UI loaded 🚀");

    // Initialize AI Manager and Search Enhancer
    const init = async () => {
      try {
        // Get AI Manager instance
        const aiManager = AIOverlayManager.getInstance();

        // Initialize AI APIs
        await aiManager.initialize();
        console.log("[Kaizen] AI Manager ready ✅");

        // Initialize Search Enhancer (only on Google Search)
        const searchEnhancer = new SearchEnhancer();
        await searchEnhancer.initialize();

        // Show AI Floating Bubble on all pages
        showAIFloatingBubble();

        console.log("[Kaizen] All systems operational 🎉");
      } catch (error) {
        console.error("[Kaizen] Initialization failed:", error);
      }
    };

    init();
  }, []);

  // We don't render anything - all UI is injected into the page
  return null;
}
