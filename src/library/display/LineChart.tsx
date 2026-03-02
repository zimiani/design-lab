import { useEffect, useRef } from 'react'
import { createChart, type UTCTimestamp } from 'lightweight-charts'
import { registerComponent } from '../registry'

interface LineChartProps {
  data: { time: string; value: number }[]
  height?: number
  variant?: 'baseline' | 'area'
  showPriceScale?: boolean
  showTimeScale?: boolean
  className?: string
}

function debounce(func: () => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

function resolveToken(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function LineChart({
  data,
  height = 200,
  variant = 'baseline',
  showPriceScale = false,
  showTimeScale = false,
  className,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)

  useEffect(() => {
    if (!containerRef.current || !data.length) return

    const positive = resolveToken('--color-content-number-positive', '#10B981')
    const negative = resolveToken('--color-content-number-negative', '#F87171')
    const areaColor = resolveToken('--color-feedback-success', '#10B981')

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { backgroundColor: 'transparent', textColor: 'rgba(0,0,0,0.4)' },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: showPriceScale, borderVisible: false },
      timeScale: { visible: showTimeScale, borderVisible: false },
      handleScroll: false,
      handleScale: false,
      crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    })
    chartRef.current = chart

    const timestamps = data.map((d) => ({
      time: (new Date(d.time).getTime() / 1000) as UTCTimestamp,
      value: d.value,
    }))

    if (variant === 'baseline') {
      const series = chart.addBaselineSeries({
        baseValue: { type: 'price', price: data[0].value },
        topLineColor: positive,
        topFillColor1: hexToRgba(positive, 0.28),
        topFillColor2: hexToRgba(positive, 0.05),
        bottomLineColor: negative,
        bottomFillColor1: hexToRgba(negative, 0.05),
        bottomFillColor2: hexToRgba(negative, 0.28),
      })
      series.setData(timestamps)
    } else {
      const series = chart.addAreaSeries({
        lineColor: areaColor,
        topColor: hexToRgba(areaColor, 0.28),
        bottomColor: hexToRgba(areaColor, 0.02),
        lineWidth: 2,
      })
      series.setData(timestamps)
    }

    chart.timeScale().fitContent()

    const handleResize = debounce(() => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
      }
    }, 100)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, height, variant, showPriceScale, showTimeScale])

  return <div ref={containerRef} className={className} />
}

registerComponent({
  name: 'LineChart',
  category: 'presentation',
  description:
    'Time-series line/area chart for price history, portfolio value, and yield curves. Uses lightweight-charts.',
  component: LineChart,
  variants: ['baseline', 'area'],
  props: [
    {
      name: 'data',
      type: '{ time: string; value: number }[]',
      required: true,
      description: 'Array of time-value data points. time should be an ISO date string.',
    },
    {
      name: 'height',
      type: 'number',
      required: false,
      defaultValue: '200',
      description: 'Chart height in pixels.',
    },
    {
      name: 'variant',
      type: "'baseline' | 'area'",
      required: false,
      defaultValue: 'baseline',
      description:
        'baseline = dual-color (green above first value, red below). area = single-color fill.',
    },
    {
      name: 'showPriceScale',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description: 'Show the right price axis.',
    },
    {
      name: 'showTimeScale',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description: 'Show the bottom time axis.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS class for the container div.',
    },
  ],
})
