"use client";

import { useEffect, useState } from "react";

interface MermaidDiagramProps {
  mermaidCode?: string;
}

export function MermaidDiagram({ mermaidCode }: MermaidDiagramProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultMermaidCode = `
    graph TD
      A([Start]) --> B[process_documents]
      B --> LL[llamaindex_analysis]
      LL --> C[parallel_verifications]
      C --> D[online_verification]
      D --> E[evaluate_verification_results]
      E --> F{Decision}
      F -->|All Pass| G[APPROVED]
      F -->|Issues Found| H{Retry Available?}
      H -->|Yes| I[RETRY_AVAILABLE]
      H -->|No| J[HUMAN_REVIEW]
      I --> K[User Retry]
      K --> B
      G --> Z[upload_to_google_drive]
      Z --> L([End])
      J --> L
      
      %% Enhanced verification details
      C --> M{DOB Verification}
      C --> N{Document Authenticity}
      C --> O{Name Verification}
      C --> P{Address Verification}
      C --> Q{Employment Verification}
      C --> R{Bank Statement Analysis}
      C --> S{Consent Verification}
      C --> T{Employer Partnership}
      
      M --> C
      N --> C
      O --> C
      P --> C
      Q --> C
      R --> C
      S --> C
      T --> C
      
      %% LlamaIndex Analysis
      LL --> LL1[Document Analysis]
      LL --> LL2[Financial Analysis]
      LL --> LL3[Risk Assessment]
      
      LL1 --> LL
      LL2 --> LL
      LL3 --> LL
      
      classDef startEnd fill:#3b82f6,stroke:#1e40af,stroke-width:3px,color:#fff
      classDef process fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
      classDef verification fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
      classDef decision fill:#fbbf24,stroke:#f59e0b,stroke-width:2px,color:#000
      classDef retry fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
      classDef humanReview fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
      classDef llamaindex fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
      classDef storage fill:#14b8a6,stroke:#0d9488,stroke-width:2px,color:#fff
      
      class A,L startEnd
      class B,C,D,E process
      class M,N,O,P,Q,R,S,T verification
      class F,H decision
      class I,K retry
      class J humanReview
      class LL,LL1,LL2,LL3 llamaindex
      class Z storage
  `;

  if (!isClient) {
    return (
      <div className="text-center text-muted-foreground">
        <p className="text-sm">KYC Workflow Diagram</p>
        <p className="text-xs">Loading workflow visualization...</p>
      </div>
    );
  }

  return (
    <div 
      className="mermaid bg-muted/20 rounded-lg p-6 overflow-x-auto"
      data-mermaid={mermaidCode || defaultMermaidCode}
    >
      <div className="text-center text-muted-foreground">
        <p className="text-sm">KYC Workflow Diagram</p>
        <p className="text-xs">Loading workflow visualization...</p>
      </div>
    </div>
  );
}
