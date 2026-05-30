import styles from "./chart-container.module.css";

const assets = {
  gaugeChart: "/credit-load/gauge-chart.svg",
} as const;

type ChartContainerProps = {
  percent: number;
};

export function ChartContainer({ percent }: ChartContainerProps) {
  return (
    <div aria-label={`Показатель долговой нагрузки ${percent}%`} className={styles.chartContainer} role="img">
      <div className={styles.chartArtboard}>
        <img alt="" aria-hidden className={styles.chartGauge} draggable={false} src={assets.gaugeChart} />
        <div aria-hidden className={styles.needleWrap}>
          <span className={styles.needle} />
        </div>
        <p className={styles.value}>{percent}%</p>
      </div>
    </div>
  );
}
