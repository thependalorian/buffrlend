/**
 * Mermaid Chart Component
 * Local implementation using the installed mermaid package
 */

'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidChartProps {
  chart: string
  id?: string
  className?: string
}

const MermaidChart: React.FC<MermaidChartProps> = ({ 
  chart, 
  id = 'mermaid-chart', 
  className = 'mermaid-chart' 
}) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })

    // Render the chart
    if (chartRef.current && chart) {
      const uniqueId = `${id}-${Date.now()}`
      mermaid.render(uniqueId, chart).then((result) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = result.svg
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error)
        if (chartRef.current) {
          chartRef.current.innerHTML = `<div class="error">Error rendering chart: ${error.message}</div>`
        }
      })
    }
  }, [chart, id])

  return <div ref={chartRef} className={className} />
}

export default MermaidChart
