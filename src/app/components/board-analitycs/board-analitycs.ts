import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { BoardAnalytics } from '../../shared/models/boardAnalitycs.model';

Chart.register(...registerables);

@Component({
  selector: 'app-board-analitycs',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterLink],
  templateUrl: './board-analitycs.html',
  styleUrl: './board-analitycs.css',
})
export class BoardAnalitycs implements OnInit {
  private destroyRef = inject(DestroyRef);

  analytics = signal<BoardAnalytics | null>(null);
  analyticsList = signal<BoardAnalytics[]>([]);
  loading = signal(false);

  /** Average completion rate across all boards */
  averageCompletionRate = computed(() => {
    const list = this.analyticsList();
    if (!list.length) return 0;
    return list.reduce((acc, b) => acc + b.completionRate, 0) / list.length;
  });

  /** Total task count across all boards */
  totalTasksCount = computed(() =>
    this.analyticsList().reduce((acc, b) => acc + b.totalCards, 0)
  );

  /** Total done count across all boards */
  totalDoneCount = computed(() =>
    this.analyticsList().reduce((acc, b) => acc + b.doneCount, 0)
  );

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartConfiguration['data'] = {
    labels: ['Da fare', 'In corso', 'Completate'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 12, weight: 600 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} task`,
        },
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (boardId) {
      this.loadAnalyticsByBoardId(boardId);
    } else {
      this.loadAnalytics();
    }
  }

  loadAnalyticsByBoardId(boardId: string): void {
    this.loading.set(true);
    this.analyticsService
      .getBoardAnalitycsByBoardId(boardId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.analytics.set(data);
          this.updateChart();
        },
        error: (err) => console.error(err),
      });
  }

  loadAnalytics(): void {
    this.loading.set(true);
    this.analyticsService
      .getBoardAnalitycs()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.analyticsList.set(data);
        },
        error: (err) => console.error(err),
      });
  }

  updateChart(): void {
    const data = this.analytics();
    if (data) {
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [
          {
            ...this.pieChartData.datasets[0],
            data: [data.todoCount, data.inProgressCount, data.doneCount],
          },
        ],
      };
    }
  }
}
