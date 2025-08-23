import React, { memo, useCallback, useMemo, useReducer } from 'react';
import { scaleTime } from 'd3-scale';
import { bisectRight } from 'd3-array';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { AreaClosed, LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { ParentSize } from '@visx/responsive';
import { curveMonotoneX } from 'd3-shape';
import { cn } from '../utils/cn';

// UTILS
const toDate = (d: any) => +new Date(d?.date || d);

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format;

const MemoAreaClosed = memo(AreaClosed);
const MemoLinePath = memo(LinePath);

function reducer(state: any, action: any) {
  const initialState = {
    close: state.close,
    date: state.date,
    translate: "0%",
    hovered: false,
  };

  switch (action.type) {
    case "UPDATE": {
      return {
        close: action.close,
        date: action.date,
        x: action.x,
        y: action.y,
        translate: `-${(1 - action.x / action.width) * 100}%`,
        hovered: true,
      };
    }
    case "CLEAR": {
      return {
        ...initialState,
        x: undefined,
        y: undefined,
      };
    }
    default:
      return state;
  }
}

interface ChartQuote {
  date: Date | string;
  close: string | number;
}

interface AreaClosedChartProps {
  chartQuotes: ChartQuote[];
  range: string;
}

function AreaClosedChart({ chartQuotes, range }: AreaClosedChartProps) {
  const margin = { top: 20, right: 30, bottom: 20, left: 30 };

  const data = useMemo(() => {
    if (!chartQuotes || chartQuotes.length === 0) return [];
    return chartQuotes.map(d => ({
      date: new Date(d.date),
      close: parseFloat(d.close.toString())
    }));
  }, [chartQuotes]);

  const [state, dispatch] = useReducer(reducer, {
    close: data[data.length - 1]?.close || 0,
    date: data[data.length - 1]?.date || new Date(),
    translate: "0%",
    hovered: false,
  });

  const isPositive = data.length > 1 && data[data.length - 1].close >= data[0].close;

  return (
    <div className="relative">
      <ParentSize>
        {({ width: parentWidth }) => {
          const chartWidth = parentWidth || 800;
          const chartHeight = 280;
          const innerWidth = chartWidth - margin.left - margin.right;
          const innerHeight = chartHeight - margin.top - margin.bottom;

          // Scales
          const xScale = useMemo(() => {
            if (data.length === 0) {
              return scaleTime()
                .range([0, innerWidth])
                .domain([new Date(), new Date()]);
            }
            return scaleTime()
              .range([0, innerWidth])
              .domain([data[0].date, data[data.length - 1].date]);
          }, [data, innerWidth]);

          const yScale = useMemo(() => {
            if (data.length === 0) {
              return scaleLinear<number>()
                .range([innerHeight, 0])
                .domain([0, 100]);
            }
            const yMax = Math.max(...data.map(d => d.close));
            const yMin = Math.min(...data.map(d => d.close));
            const padding = (yMax - yMin) * 0.1;
            
            return scaleLinear<number>()
              .range([innerHeight, 0])
              .domain([yMin - padding, yMax + padding]);
          }, [data, innerHeight]);

          // Accessors
          const getDate = (d: any) => d.date;
          const getStockValue = (d: any) => d.close;

          const handleTooltip = (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = xScale.invert(x - margin.left);
            
            if (!x0) return;
            
            const index = bisectRight(data.map(getDate), x0, 1);
            const d0 = data[index - 1];
            const d1 = data[index];
            
            if (!d0 && !d1) return;
            
            let d = d0;
            if (d1 && getDate(d1)) {
              d = Math.abs(+x0 - +getDate(d0)) > Math.abs(+x0 - +getDate(d1)) ? d1 : d0;
            }

            dispatch({
              type: "UPDATE",
              close: getStockValue(d),
              date: getDate(d),
              x: xScale(getDate(d)) || 0,
              y: yScale(getStockValue(d)) || 0,
              width: innerWidth,
            });
          };

          return (
          <svg width={chartWidth} height={chartHeight}>
            <LinearGradient
              id="area-gradient"
              from={isPositive ? "#10b981" : "#ef4444"}
              to={isPositive ? "#10b981" : "#ef4444"}
              fromOpacity={0.3}
              toOpacity={0}
            />
            <LinearGradient
              id="line-gradient"
              from={isPositive ? "#10b981" : "#ef4444"}
              to={isPositive ? "#059669" : "#dc2626"}
            />
            
            <g transform={`translate(${margin.left},${margin.top})`}>
              <MemoAreaClosed
                data={data}
                x={(d) => xScale(getDate(d)) ?? 0}
                y={(d) => yScale(getStockValue(d)) ?? 0}
                yScale={yScale}
                strokeWidth={2}
                stroke="url(#line-gradient)"
                fill="url(#area-gradient)"
                curve={curveMonotoneX}
              />
              
              <MemoLinePath
                data={data}
                x={(d) => xScale(getDate(d)) ?? 0}
                y={(d) => yScale(getStockValue(d)) ?? 0}
                stroke="url(#line-gradient)"
                strokeWidth={2}
                curve={curveMonotoneX}
              />

              {state.hovered && (
                <g>
                  <line
                    x1={state.x}
                    x2={state.x}
                    y1={0}
                    y2={innerHeight}
                    stroke="#6b7280"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                    opacity={0.5}
                  />
                  <circle
                    cx={state.x}
                    cy={state.y}
                    r={4}
                    fill={isPositive ? "#10b981" : "#ef4444"}
                    stroke="white"
                    strokeWidth={2}
                  />
                </g>
              )}

              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
                onTouchStart={handleTooltip}
                onTouchMove={handleTooltip}
                onMouseMove={handleTooltip}
                onMouseLeave={() => dispatch({ type: "CLEAR" })}
              />
            </g>
          </svg>
        )}}
      </ParentSize>
      
      {state.hovered && (
        <div
          className="absolute top-4 z-10 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm border border-gray-200"
          style={{ transform: `translateX(${state.translate})`, right: 0 }}
        >
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(state.close)}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(state.date).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

interface EnhancedStockChartProps {
  symbol: string;
  data: ChartQuote[];
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  range?: string;
}

export default function EnhancedStockChart({ 
  symbol, 
  data, 
  currentPrice, 
  change, 
  changePercent,
  range = "1D"
}: EnhancedStockChartProps) {
  const isPositive = change ? change >= 0 : false;

  return (
    <div className="h-[350px] w-full">
      <div className="mb-4">
        <div className="space-x-1 text-gray-600">
          <span className="font-bold text-gray-900">{symbol}</span>
          <span>·</span>
          <span>NASDAQ</span>
        </div>

        <div className="flex flex-row items-end justify-between">
          <div className="space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {currentPrice ? formatCurrency(currentPrice) : '--'}
            </span>
            {change !== undefined && changePercent !== undefined && (
              <span className={cn(
                "font-semibold",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {range}
          </span>
        </div>
      </div>
      
      {!data || data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center text-gray-500">
          No data available
        </div>
      ) : (
        <AreaClosedChart chartQuotes={data} range={range} />
      )}
    </div>
  );
}