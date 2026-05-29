export const TREND_CHART = {
  width: 321,
  height: 172,
  barLeft: 52.87,
  barWidth: 16,
  barAreaTop: 54,
  barAreaHeight: 87.139,
  barAreaWidth: 265.5,
  gridLineLeft: 2.5,
  gridLineWidth: 285.472,
  gridLineYs: [15.07, 79.07, 142.07] as const,
  lineYMin: 64,
  lineYMax: 110,
} as const;

export function getTrendBarLayout(barCount: number) {
  const { barAreaWidth, barWidth, barLeft } = TREND_CHART;
  const gap = barCount > 1 ? (barAreaWidth - barCount * barWidth) / (barCount - 1) : 0;

  return {
    barLeft,
    barWidth,
    barStep: barWidth + gap,
  };
}

export function getTrendBarX(index: number, barCount: number) {
  const { barLeft, barStep } = getTrendBarLayout(barCount);

  return barLeft + index * barStep;
}

export function valueToBarHeight(value: number, maxScale: number) {
  return Math.max(10, Math.round((value / maxScale) * TREND_CHART.barAreaHeight));
}

export function buildTrendLinePoints(lineValues: number[], barCount: number) {
  const max = Math.max(...lineValues, 1);
  const { barLeft, barWidth, barStep } = getTrendBarLayout(barCount);
  const range = TREND_CHART.lineYMax - TREND_CHART.lineYMin;

  return lineValues.map((value, index) => ({
    x: barLeft + index * barStep + barWidth / 2,
    y: TREND_CHART.lineYMin + (1 - value / max) * range,
  }));
}
