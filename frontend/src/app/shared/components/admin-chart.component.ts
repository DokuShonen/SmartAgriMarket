import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  fillColor?: string;
  type?: 'bar' | 'line';
}

@Component({
  selector: 'app-admin-chart',
  standalone: true,
  imports: [NgIf, BaseChartDirective],
  template: `
    <div class="chart-card" [class.loading]="!hasData">
      <div class="chart-header">
        <h3>{{ title }}</h3>
        <span class="chart-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
      </div>
      <div class="chart-body" *ngIf="hasData">
        <canvas baseChart
          [data]="chartData!"
          [options]="chartOptions"
          [type]="$any(chartType)"
        ></canvas>
      </div>
      <div class="chart-empty" *ngIf="!hasData">
        <span class="material-icons-outlined">bar_chart</span>
        <p>Aucune donnée disponible</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      background: #fff;
      border: 1px solid var(--n-100, #f4f3f0);
      border-radius: 14px;
      padding: 20px;
      transition: box-shadow 0.2s;
    }
    .chart-card:hover { box-shadow: var(--shadow-sm); }

    .chart-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 16px;
    }
    .chart-header h3 {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--heading-color, #243238);
    }
    .chart-subtitle {
      font-size: 12px;
      color: var(--text-dim, #a9a49b);
    }

    .chart-body {
      position: relative;
      width: 100%;
      min-height: 220px;
    }

    .chart-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: var(--text-dim, #a9a49b);
    }
    .chart-empty .material-icons-outlined { font-size: 2.5rem; margin-bottom: 8px; opacity: 0.4; }
    .chart-empty p { font-size: 13px; }

    @media (max-width: 768px) {
      .chart-card { padding: 16px; }
      .chart-body { min-height: 180px; }
    }
  `]
})
export class AdminChartComponent implements OnChanges {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() chartType: 'bar' | 'line' | 'doughnut' | 'pie' = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: ChartDataset[] = [];

  chartData: ChartData<any> | null = null;
  hasData = false;

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { family: "'Outfit', sans-serif", size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        }
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleFont: { family: "'Outfit', sans-serif", weight: 'bold' as const },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
        cornerRadius: 8,
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Outfit', sans-serif", size: 11 },
          color: '#a1a1aa',
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          font: { family: "'Outfit', sans-serif", size: 11 },
          color: '#a1a1aa',
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['labels'] || changes['datasets']) {
      this.buildChart();
    }
  }

  private buildChart() {
    if (!this.labels.length || !this.datasets.length) {
      this.hasData = false;
      return;
    }

    this.hasData = true;

    const defaultColors = [
      { border: '#27a337', bg: 'rgba(39, 163, 55, 0.15)' },
      { border: '#ff8a29', bg: 'rgba(255, 138, 41, 0.15)' },
      { border: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.15)' },
      { border: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)' },
    ];

    const isDoughnut = this.chartType === 'doughnut' || this.chartType === 'pie';

    this.chartData = {
      labels: this.labels,
      datasets: this.datasets.map((ds, i) => {
        const palette = defaultColors[i % defaultColors.length];
        const dsType = ds.type || this.chartType;
        const isLine = dsType === 'line';

        return {
          label: ds.label,
          data: ds.data,
          type: ds.type,
          borderColor: ds.color || palette.border,
          backgroundColor: isDoughnut
            ? defaultColors.map(c => c.border)
            : isLine
              ? (ds.fillColor || palette.bg)
              : (ds.color || palette.border),
          borderWidth: isLine ? 2.5 : isDoughnut ? 2 : 0,
          fill: isLine,
          tension: 0.4,
          pointRadius: isLine ? 4 : 0,
          pointHoverRadius: isLine ? 6 : 0,
          pointBackgroundColor: ds.color || palette.border,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderRadius: dsType === 'bar' ? 6 : 0,
          barPercentage: 0.7,
        };
      })
    } as ChartData;

    // Doughnut/pie: no scales
    if (isDoughnut) {
      const current = this.chartOptions as any;
      const plugins = current?.plugins || {};
      this.chartOptions = {
        ...current,
        scales: undefined,
        plugins: {
          ...plugins,
          legend: {
            ...plugins.legend,
            position: 'right',
          }
        }
      };
    }

    // Mixed charts: interaction mode
    if (this.datasets.some(ds => ds.type)) {
      (this.chartOptions as any) = {
        ...this.chartOptions,
        interaction: { intersect: false, mode: 'index' },
      };
    }
  }
}
