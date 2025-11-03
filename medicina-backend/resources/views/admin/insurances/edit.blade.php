@extends('admin.layout')

@section('title','Insurances')

@section('content')
<body class="bg-gray-50">
    <div class="flex min-h-screen">
        
        @include('admin.sidebar')
        <!-- Main Content -->
        <main id="main-content" class="content-expanded flex-1 transition-all duration-300">
           @include('admin.toolbar')

             <!-- Create Insurance Form -->
            <div class="p-6">
                <div class="max-w-2xl mx-auto">
                    <div class="bg-white rounded-lg shadow-sm">
                        <!-- Header -->
                        <div class="p-6 border-b border-gray-200">
                            <h1 class="text-2xl font-semibold text-gray-900">Edit Insurance Company</h1>
                            <p class="text-sm text-gray-600 mt-1">Edit the insurance company details</p>
                        </div>

                        <!-- Form -->
                        <form action="{{ route('admin.insurances.update',$insurance->insurance_id) }}" method="POST" class="p-6">
                            @csrf
                            @method('PUT')
                            <!-- Insurance Company Name -->
                            <div class="mb-6">
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name <span class="text-red-500">*</span>
                                </label>
                                <input type="text" 
                                       name="name" 
                                       id="name" 
                                       value="{{ $insurance->name }}"
                                       required
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                       placeholder="Enter insurance company name">
                                @error('name')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex justify-end space-x-3">
                                <a href="{{ route('admin.insurances.index') }}" 
                                   class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </a>
                                <button type="submit" 
                                        class="px-4 py-2 bg-medicina-brand-600 text-white rounded-lg hover:bg-medicina-brand-700">
                                    Update Insurance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>

    
    </body>


@endsection