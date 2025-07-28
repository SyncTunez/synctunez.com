import { capturePerformanceError, addBreadcrumb } from '@/lib/sentry';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  context?: Record<string, any>;
}

export interface PerformanceTimer {
  startTime: number;
  name: string;
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private timers: Map<string, PerformanceTimer> = new Map();
  private metrics: PerformanceMetric[] = [];

  /**
   * Start a performance timer
   */
  startTimer(name: string, context?: Record<string, any>): void {
    const timer: PerformanceTimer = {
      startTime: performance.now(),
      name,
      context
    };
    this.timers.set(name, timer);
    
    addBreadcrumb('Performance timer started', 'performance', {
      name,
      context
    });
  }

  /**
   * End a performance timer and record the duration
   */
  endTimer(name: string, threshold?: number): number {
    const timer = this.timers.get(name);
    if (!timer) {
      console.warn(`Performance timer '${name}' not found`);
      return 0;
    }

    const duration = performance.now() - timer.startTime;
    this.timers.delete(name);

    addBreadcrumb('Performance timer ended', 'performance', {
      name,
      duration,
      threshold,
      context: timer.context
    });

    // Check if duration exceeds threshold
    if (threshold && duration > threshold) {
      capturePerformanceError(
        `Performance timer '${name}' exceeded threshold: ${duration}ms > ${threshold}ms`,
        {
          operation: name,
          duration,
          threshold,
          additionalData: timer.context
        },
        'warning'
      );
    }

    return duration;
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    addBreadcrumb('Performance metric recorded', 'performance', {
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
      threshold: metric.threshold,
      context: metric.context
    });

    // Check if metric exceeds threshold
    if (metric.threshold && metric.value > metric.threshold) {
      capturePerformanceError(
        `Performance metric '${metric.name}' exceeded threshold: ${metric.value}${metric.unit} > ${metric.threshold}${metric.unit}`,
        {
          operation: metric.name,
          duration: metric.value,
          threshold: metric.threshold,
          additionalData: metric.context
        },
        'warning'
      );
    }
  }

  /**
   * Measure the performance of an async function
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    threshold?: number,
    context?: Record<string, any>
  ): Promise<T> {
    this.startTimer(name, context);
    try {
      const result = await fn();
      const duration = this.endTimer(name, threshold);
      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        threshold,
        context
      });
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Measure the performance of a synchronous function
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    threshold?: number,
    context?: Record<string, any>
  ): T {
    this.startTimer(name, context);
    try {
      const result = fn();
      const duration = this.endTimer(name, threshold);
      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        threshold,
        context
      });
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const metrics = [
            {
              name: 'page_load_time',
              value: navigation.loadEventEnd - navigation.loadEventStart,
              unit: 'ms',
              threshold: 3000,
              context: { url: window.location.href }
            },
            {
              name: 'dom_content_loaded',
              value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              unit: 'ms',
              threshold: 2000,
              context: { url: window.location.href }
            },
            {
              name: 'first_paint',
              value: navigation.responseStart - navigation.requestStart,
              unit: 'ms',
              threshold: 1000,
              context: { url: window.location.href }
            }
          ];

          metrics.forEach(metric => this.recordMetric(metric));
        }
      }, 0);
    });
  }

  /**
   * Monitor API call performance
   */
  monitorAPICalls(): void {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        this.recordMetric({
          name: 'api_call',
          value: duration,
          unit: 'ms',
          threshold: 5000,
          context: {
            url,
            method: args[1]?.method || 'GET',
            status: response.status
          }
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.recordMetric({
          name: 'api_call_error',
          value: duration,
          unit: 'ms',
          context: {
            url,
            method: args[1]?.method || 'GET',
            error: error instanceof Error ? error.message : String(error)
          }
        });
        
        throw error;
      }
    };
  }
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export convenience functions
export const startTimer = (name: string, context?: Record<string, any>) => 
  performanceMonitor.startTimer(name, context);

export const endTimer = (name: string, threshold?: number) => 
  performanceMonitor.endTimer(name, threshold);

export const recordMetric = (metric: PerformanceMetric) => 
  performanceMonitor.recordMetric(metric);

export const measureAsync = <T>(
  name: string,
  fn: () => Promise<T>,
  threshold?: number,
  context?: Record<string, any>
) => performanceMonitor.measureAsync(name, fn, threshold, context);

export const measureSync = <T>(
  name: string,
  fn: () => T,
  threshold?: number,
  context?: Record<string, any>
) => performanceMonitor.measureSync(name, fn, threshold, context); 