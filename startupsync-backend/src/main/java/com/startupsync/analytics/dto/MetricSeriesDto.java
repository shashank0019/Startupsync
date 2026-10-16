package com.startupsync.analytics.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class MetricSeriesDto {
    private String label;
    private long total;
    private List<Long> values;

    public MetricSeriesDto(String label, long total, List<Long> values) {
        this.label = label;
        this.total = total;
        this.values = values;
    }

    public static MetricSeriesDtoBuilder builder() {
        return new MetricSeriesDtoBuilder();
    }

    public static class MetricSeriesDtoBuilder {
        private String label;
        private long total;
        private List<Long> values;

        MetricSeriesDtoBuilder() {}

        public MetricSeriesDtoBuilder label(String label) {
            this.label = label;
            return this;
        }

        public MetricSeriesDtoBuilder total(long total) {
            this.total = total;
            return this;
        }

        public MetricSeriesDtoBuilder values(List<Long> values) {
            this.values = values;
            return this;
        }

        public MetricSeriesDto build() {
            return new MetricSeriesDto(label, total, values);
        }
    }
}
