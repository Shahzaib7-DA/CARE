import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendChartProps {
  data: Array<{ time: string; value: number }>
  title?: string
  description?: string
  variant?: 'line' | 'area'
  showGrid?: boolean
  height?: number
}

export function TrendChart({
  data,
  title = 'Risk Trend',
  description = 'Historical risk progression',
  variant = 'line',
  showGrid = true,
  height = 300,
}: TrendChartProps) {
  const ChartComponent = variant === 'area' ? AreaChart : LineChart

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis
              dataKey="time"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              domain={[0, 1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
            />
            {variant === 'area' ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.1}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface VitalsChartProps {
  data: Array<{
    label: string
    value: number
    normal_range: [number, number]
  }>
  title?: string
}

export function VitalsChart({ data, title = 'Current Vitals' }: VitalsChartProps) {
  const chartData = data.map((vital) => ({
    name: vital.label,
    current: vital.value,
    min: vital.normal_range[0],
    max: vital.normal_range[1],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="#cbd5e1"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke="#cbd5e1"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
