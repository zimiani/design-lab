/** Shared SVG chart utilities — Catmull-Rom → Bezier smoothing + pointer interaction helpers */

export interface ChartDataPoint {
  value: number
  timestamp: Date
}

export interface ChartPoint {
  x: number
  y: number
  value: number
  timestamp: Date
}

/**
 * Build a smooth cubic bezier SVG path from data points using Catmull-Rom interpolation.
 * Returns the SVG `d` attribute and pixel-mapped points for interaction.
 */
export function buildSmoothPath(
  data: ChartDataPoint[],
  width: number,
  height: number,
  padY = 8,
): { path: string; points: ChartPoint[] } {
  const values = data.map(d => d.value)
  const min = Math.min(...values) * 0.998
  const max = Math.max(...values) * 1.002
  const range = max - min || 1

  const points: ChartPoint[] = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: padY + (height - padY * 2) - ((d.value - min) / range) * (height - padY * 2),
    value: d.value,
    timestamp: d.timestamp,
  }))

  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  return { path: d, points }
}

/**
 * Build a closed SVG path for the area fill beneath the chart line.
 * Goes: line path → bottom-right → bottom-left.
 */
export function buildAreaPath(linePath: string, width: number, height: number): string {
  return `${linePath} L${width},${height} L0,${height} Z`
}

/** Format a chart date in pt-BR: "em 5 de Março, 14:00" */
export function formatChartDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleString('pt-BR', { month: 'long' })
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1)
  const hours = date.getHours().toString().padStart(2, '0')
  return `em ${day} de ${monthCap}, ${hours}:00`
}
