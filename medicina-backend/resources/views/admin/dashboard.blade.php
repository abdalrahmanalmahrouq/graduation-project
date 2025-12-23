@extends('admin.layout')

@section('title','Admin Dashboard')

@section('content')
<body class="bg-gray-50">
    <div class="flex min-h-screen">
        
        @include('admin.sidebar')
        <!-- Main Content -->
        <main id="main-content" class="content-expanded flex-1 transition-all duration-300">
           @include('admin.toolbar')

            <!-- Dashboard Content -->
            <div class="p-6">
                <!-- Welcome Card -->
                <div class="bg-gradient-to-r from-medicina-brand-500 to-medicina-brand-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">Welcome back, {{ auth('admin')->user()->name }}!</h2>
                            <p class="opacity-90">Here's what's happening today in your system.</p>
                        </div>
                        <div class="mt-4 md:mt-0">
                            <div class="text-right">
                                <p class="text-sm opacity-90">Today</p>
                                <p class="text-lg font-semibold" id="current-date"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="loading-state" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medicina-brand-500"></div>
                </div>

                <!-- Statistics Cards -->
                <div id="stats-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <!-- Patients Card -->
                    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                                <h3 class="text-3xl font-bold text-gray-900" id="patients-count">0</h3>
                            </div>
                            <div class="bg-blue-100 rounded-full p-3">
                                <i class="fas fa-users text-blue-600 text-2xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Doctors Card -->
                    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600 mb-1">Total Doctors</p>
                                <h3 class="text-3xl font-bold text-gray-900" id="doctors-count">0</h3>
                            </div>
                            <div class="bg-green-100 rounded-full p-3">
                                <i class="fas fa-user-md text-green-600 text-2xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Appointments Card -->
                    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-purple-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600 mb-1">Total Appointments</p>
                                <h3 class="text-3xl font-bold text-gray-900" id="appointments-count">0</h3>
                            </div>
                            <div class="bg-purple-100 rounded-full p-3">
                                <i class="fas fa-calendar-check text-purple-600 text-2xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Insurances Card -->
                    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-orange-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600 mb-1">Total Insurances</p>
                                <h3 class="text-3xl font-bold text-gray-900" id="insurances-count">0</h3>
                            </div>
                            <div class="bg-orange-100 rounded-full p-3">
                                <i class="fas fa-shield-alt text-orange-600 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div id="charts-container" class="hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Bar Chart Card -->
                    <div class="bg-white rounded-xl shadow-md p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-4">Entity Statistics Overview</h3>
                        <div class="h-80">
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>

                    <!-- Pie Chart Card -->
                    <div class="bg-white rounded-xl shadow-md p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-4">Distribution Overview</h3>
                        <div class="h-80">
                            <canvas id="pieChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Chart.js Library -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    
    <script>
        // Set current date
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Animation function for counting up
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                element.textContent = current.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Fetch statistics
        async function fetchStatistics() {
            try {
                const response = await fetch('{{ route("admin.count-entities") }}', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    
                    // Hide loading, show content
                    document.getElementById('loading-state').classList.add('hidden');
                    document.getElementById('stats-container').classList.remove('hidden');
                    document.getElementById('charts-container').classList.remove('hidden');
                    
                    // Animate counts
                    animateValue(document.getElementById('patients-count'), 0, data.patients, 1500);
                    animateValue(document.getElementById('doctors-count'), 0, data.doctors, 1500);
                    animateValue(document.getElementById('appointments-count'), 0, data.appointments, 1500);
                    animateValue(document.getElementById('insurances-count'), 0, data.insurances, 1500);
                    animateValue(document.getElementById('labs-count'), 0, data.labs, 1500);
                    // Create charts
                    createBarChart(data);
                    createPieChart(data);
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
                document.getElementById('loading-state').innerHTML = 
                    '<p class="text-red-600">Failed to load statistics. Please refresh the page.</p>';
            }
        }

        // Create Bar Chart
        function createBarChart(data) {
            const ctx = document.getElementById('barChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Patients', 'Doctors', 'Appointments', 'Insurances', 'Labs'],
                    datasets: [{
                        label: 'Count',
                        data: [data.patients, data.doctors, data.appointments, data.insurances, data.labs],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(100, 100, 100, 0.8)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(249, 115, 22, 1)',
                            'rgba(100, 100, 100, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return 'Count: ' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    size: 12
                                },
                                color: '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                color: '#6b7280'
                            }
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        // Create Pie Chart
        function createPieChart(data) {
            const ctx = document.getElementById('pieChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Patients', 'Doctors', 'Appointments', 'Insurances', 'Labs'],
                    datasets: [{
                        data: [data.patients, data.doctors, data.appointments, data.insurances, data.labs],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(100, 100, 100, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)'
                        ],
                        borderWidth: 3,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 13,
                                    weight: '500'
                                },
                                color: '#374151',
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return label + ': ' + value.toLocaleString() + ' (' + percentage + '%)';
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    },
                    cutout: '60%'
                }
            });
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            fetchStatistics();
        });
    </script>
    
    </body>
@endsection


