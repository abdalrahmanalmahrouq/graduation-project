@extends('admin.layout')

@section('title','Admin Login')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
    <!-- Logo -->
    <div class="flex justify-center mb-4">
      <img src="{{ asset('images/logo.png') }}" alt="Medicina Logo" class="h-16 w-auto object-contain">
    </div>
    <h1 class="text-2xl font-bold text-center text-medicina-brand mb-1">MediCina Admin</h1>
    <p class="text-center text-gray-500 mb-6">Sign in to access the dashboard</p>

    @if(session('status'))
      <div class="bg-medicina-brand-50 text-medicina-brand-700 p-2 rounded-lg mb-3 text-sm text-center">
        {{ session('status') }}
      </div>
    @endif

    <form method="POST" action="{{ route('admin.login.store') }}" class="space-y-5">
      @csrf
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required autofocus
               class="w-full border-gray-300 rounded-lg focus:ring-medicina-brand-500 focus:border-medicina-brand-500"/>
        @error('email') <p class="text-sm text-red-600 mt-1">{{ $message }}</p> @enderror
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" name="password" required
               class="w-full border-gray-300 rounded-lg focus:ring-medicina-brand-500 focus:border-medicina-brand-500"/>
        @error('password') <p class="text-sm text-red-600 mt-1">{{ $message }}</p> @enderror
      </div>

      <div class="flex items-center justify-between text-sm text-gray-600">
        <label class="flex items-center space-x-2">
          <input type="checkbox" name="remember" class="rounded border-gray-300 text-medicina-brand-600 focus:ring-medicina-brand-500">
          <span>Remember me</span>
        </label>
        <span>No registration available</span>
      </div>

      <button type="submit"
              class="w-full bg-medicina-brand-600 hover:bg-medicina-brand-700 text-white font-semibold py-2.5 rounded-lg transition">
        Sign In
      </button>
    </form>
  </div>
</div>
@endsection
