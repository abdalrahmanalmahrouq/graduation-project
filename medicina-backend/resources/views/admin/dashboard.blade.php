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
                <div class="bg-gradient-to-r from-medicina-brand-500 to-medicina-brand-600 rounded-2xl p-6 mb-6 text-white">
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
            </div>
        </main>
    </div>

    
    </body>
@endsection


