
<!-- Sidebar -->
<aside id="sidebar" class="sidebar-transition sidebar-expanded bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50">
            <!-- Logo Header -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center space-x-3">
                        <img src="{{ asset('images/logo.png') }}" alt="Medicina Logo" class="w-10 h-10 object-contain">
                        <div class="sidebar-logo-text">
                            <h1 class="text-xl font-bold text-gray-800">Medicina</h1>
                            <p class="text-xs text-gray-500">Dashboard</p>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="flex-1 overflow-y-auto py-4">
                <div class="px-4 space-y-2">
                    <a href="{{ route('admin.dashboard') }}" 
                       class="sidebar-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }} flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium">
                        <i class="fas fa-home text-xl"></i>
                        <span class="sidebar-text">Dashboard</span>
                    </a>
                    <a href="{{ route('admin.insurances.index') }}" 
                       class="sidebar-item {{ request()->routeIs('admin.insurances.*') ? 'active' : '' }} flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium">
                        <i class="fas fa-building text-xl"></i>
                        <span class="sidebar-text">Insurance Companies</span>
                    </a>           
                </div>
            </nav>  
            <div class="p-4 border-t border-gray-200"> 
                <form method="POST" action="{{ route('admin.logout') }}">
                 @csrf
                <button  class="w-full mt-auto bg-medicina-brand-600 hover:bg-medicina-brand-700 text-white rounded-lg py-2 transition">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>
              </form>      
            </div>
        </aside>
