type CartesianPoint = {
  x: number;
  y: number;
};

type LineChartPoint = {
  value: number;
};

type RadarMetric = {
  value: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function buildLineChartPaths(
  points: LineChartPoint[],
  width: number,
  height: number,
  padding: number,
) {
  if (points.length === 0) {
    return { linePath: "", areaPath: "", coordinates: [] as CartesianPoint[] };
  }

  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const span = Math.max(maxValue - minValue, 1);
  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const coordinates = points.map((point, index) => ({
    x: padding + stepX * index,
    y:
      height -
      padding -
      ((point.value - minValue) / span) * (height - padding * 2),
  }));

  const linePath = coordinates.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = coordinates[index - 1];
    const controlX = (previous.x + point.x) / 2;

    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const areaPath =
    `${linePath} L ${coordinates.at(-1)?.x ?? 0} ${height - padding} ` +
    `L ${coordinates[0]?.x ?? 0} ${height - padding} Z`;

  return { linePath, areaPath, coordinates };
}

export function buildRadarPoints(
  metrics: RadarMetric[],
  radius: number,
  center: number,
  maxValue = 100,
) {
  return metrics.map((metric, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metrics.length;
    const ratio = clamp(metric.value / maxValue, 0, 1);
    const pointRadius = radius * ratio;

    return {
      x: center + Math.cos(angle) * pointRadius,
      y: center + Math.sin(angle) * pointRadius,
      angle,
    };
  });
}

export function buildRadarPolygon(
  metrics: RadarMetric[],
  radius: number,
  center: number,
) {
  return buildRadarPoints(metrics, radius, center)
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
}

export function buildRadarGrid(
  sides: number,
  levels: number,
  radius: number,
  center: number,
) {
  return Array.from({ length: levels }, (_, index) => {
    const currentRadius = (radius / levels) * (index + 1);

    return Array.from({ length: sides }, (_, sideIndex) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * sideIndex) / sides;

      return `${center + Math.cos(angle) * currentRadius},${center + Math.sin(angle) * currentRadius}`;
    }).join(" ");
  });
}

export function buildRadarAxisVertices(sides: number, radius: number, center: number) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      angle,
    };
  });
}

export function getRadarLabelPosition(
  axisIndex: number,
  sides: number,
  radius: number,
  center: number,
  labelOffset = 44,
) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * axisIndex) / sides;
  const labelRadius = radius + labelOffset;

  return {
    left: `${((center + Math.cos(angle) * labelRadius) / (center * 2)) * 100}%`,
    top: `${((center + Math.sin(angle) * labelRadius) / (center * 2)) * 100}%`,
  };
}

