# Metrics

Prometheus metrics are supported by default on our public API.

```yaml title="/metrics"
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.179971

# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total 0.033905

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 0.213876

# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1625048430

# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 46891008

# HELP nodejs_eventloop_lag_seconds Lag of event loop in seconds.
# TYPE nodejs_eventloop_lag_seconds gauge
nodejs_eventloop_lag_seconds 0

# HELP nodejs_eventloop_lag_min_seconds The minimum recorded event loop delay.
# TYPE nodejs_eventloop_lag_min_seconds gauge
nodejs_eventloop_lag_min_seconds 0.008040448

# HELP nodejs_eventloop_lag_max_seconds The maximum recorded event loop delay.
# TYPE nodejs_eventloop_lag_max_seconds gauge
nodejs_eventloop_lag_max_seconds 0.018546687

# HELP nodejs_eventloop_lag_mean_seconds The mean of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_mean_seconds gauge
nodejs_eventloop_lag_mean_seconds 0.01193890429700599

# HELP nodejs_eventloop_lag_stddev_seconds The standard deviation of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_stddev_seconds gauge
nodejs_eventloop_lag_stddev_seconds 0.0008701023570289598

# HELP nodejs_eventloop_lag_p50_seconds The 50th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p50_seconds gauge
nodejs_eventloop_lag_p50_seconds 0.012525567

# HELP nodejs_eventloop_lag_p90_seconds The 90th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p90_seconds gauge
nodejs_eventloop_lag_p90_seconds 0.012566527

# HELP nodejs_eventloop_lag_p99_seconds The 99th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p99_seconds gauge
nodejs_eventloop_lag_p99_seconds 0.012730367

# HELP nodejs_active_handles Number of active libuv handles grouped by handle type. Every handle type is C++ class name.
# TYPE nodejs_active_handles gauge
nodejs_active_handles{type="WriteStream"} 2
nodejs_active_handles{type="Socket"} 4
nodejs_active_handles{type="Server"} 1
nodejs_active_handles{type="Http2Server"} 1

# HELP nodejs_active_handles_total Total number of active handles.
# TYPE nodejs_active_handles_total gauge
nodejs_active_handles_total 8

# HELP nodejs_active_requests Number of active libuv requests grouped by request type. Every request type is C++ class name.
# TYPE nodejs_active_requests gauge

# HELP nodejs_active_requests_total Total number of active requests.
# TYPE nodejs_active_requests_total gauge
nodejs_active_requests_total 0

# HELP nodejs_heap_size_total_bytes Process heap size from Node.js in bytes.
# TYPE nodejs_heap_size_total_bytes gauge
nodejs_heap_size_total_bytes 24985600

# HELP nodejs_heap_size_used_bytes Process heap size used from Node.js in bytes.
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes 21359504

# HELP nodejs_external_memory_bytes Node.js external memory size in bytes.
# TYPE nodejs_external_memory_bytes gauge
nodejs_external_memory_bytes 1613428

# HELP nodejs_heap_space_size_total_bytes Process heap space size total from Node.js in bytes.
# TYPE nodejs_heap_space_size_total_bytes gauge
nodejs_heap_space_size_total_bytes{space="read_only"} 180224
nodejs_heap_space_size_total_bytes{space="old"} 20561920
nodejs_heap_space_size_total_bytes{space="code"} 671744
nodejs_heap_space_size_total_bytes{space="map"} 1327104
nodejs_heap_space_size_total_bytes{space="large_object"} 475136
nodejs_heap_space_size_total_bytes{space="code_large_object"} 720896
nodejs_heap_space_size_total_bytes{space="new_large_object"} 0
nodejs_heap_space_size_total_bytes{space="new"} 1048576

# HELP nodejs_heap_space_size_used_bytes Process heap space size used from Node.js in bytes.
# TYPE nodejs_heap_space_size_used_bytes gauge
nodejs_heap_space_size_used_bytes{space="read_only"} 167672
nodejs_heap_space_size_used_bytes{space="old"} 18763416
nodejs_heap_space_size_used_bytes{space="code"} 374208
nodejs_heap_space_size_used_bytes{space="map"} 775512
nodejs_heap_space_size_used_bytes{space="large_object"} 439120
nodejs_heap_space_size_used_bytes{space="code_large_object"} 616512
nodejs_heap_space_size_used_bytes{space="new_large_object"} 0
nodejs_heap_space_size_used_bytes{space="new"} 231016

# HELP nodejs_heap_space_size_available_bytes Process heap space size available from Node.js in bytes.
# TYPE nodejs_heap_space_size_available_bytes gauge
nodejs_heap_space_size_available_bytes{space="read_only"} 0
nodejs_heap_space_size_available_bytes{space="old"} 289768
nodejs_heap_space_size_available_bytes{space="code"} 150080
nodejs_heap_space_size_available_bytes{space="map"} 365848
nodejs_heap_space_size_available_bytes{space="large_object"} 0
nodejs_heap_space_size_available_bytes{space="code_large_object"} 0
nodejs_heap_space_size_available_bytes{space="new_large_object"} 1031072
nodejs_heap_space_size_available_bytes{space="new"} 800056

# HELP nodejs_version_info Node.js version info.
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v16.2.0",major="16",minor="2",patch="0"} 1

# HELP nodejs_gc_duration_seconds Garbage collection duration by kind, one of major, minor, incremental or weakcb.
# TYPE nodejs_gc_duration_seconds histogram
nodejs_gc_duration_seconds_bucket{le="0.001",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="0.01",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="0.1",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="1",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="2",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="5",kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="+Inf",kind="incremental"} 4
nodejs_gc_duration_seconds_sum{kind="incremental"} 0.0011841659545898436
nodejs_gc_duration_seconds_count{kind="incremental"} 4
nodejs_gc_duration_seconds_bucket{le="0.001",kind="major"} 0
nodejs_gc_duration_seconds_bucket{le="0.01",kind="major"} 2
nodejs_gc_duration_seconds_bucket{le="0.1",kind="major"} 2
nodejs_gc_duration_seconds_bucket{le="1",kind="major"} 2
nodejs_gc_duration_seconds_bucket{le="2",kind="major"} 2
nodejs_gc_duration_seconds_bucket{le="5",kind="major"} 2
nodejs_gc_duration_seconds_bucket{le="+Inf",kind="major"} 2
nodejs_gc_duration_seconds_sum{kind="major"} 0.005902666568756104
nodejs_gc_duration_seconds_count{kind="major"} 2

# HELP http_request_duration_seconds request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="0.1",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="0.5",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="1",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="3",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="5",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="10",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/",status_code="200"} 1
http_request_duration_seconds_sum{method="GET",route="/",status_code="200"} 0.009224292
http_request_duration_seconds_count{method="GET",route="/",status_code="200"} 1

# HELP http_request_summary_seconds request duration in seconds summary
# TYPE http_request_summary_seconds summary
http_request_summary_seconds{quantile="0.5",method="GET",route="/",status_code="200"} 0.008036292
http_request_summary_seconds{quantile="0.9",method="GET",route="/",status_code="200"} 0.008036292
http_request_summary_seconds{quantile="0.95",method="GET",route="/",status_code="200"} 0.008036292
http_request_summary_seconds{quantile="0.99",method="GET",route="/",status_code="200"} 0.008036292
http_request_summary_seconds_sum{method="GET",route="/",status_code="200"} 0.008036292
http_request_summary_seconds_count{method="GET",route="/",status_code="200"} 1
```
