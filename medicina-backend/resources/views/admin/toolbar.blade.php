 <!-- Top Navigation Bar -->
 <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
                <div class="flex items-center space-x-4">
                    <button id="toggle-sidebar" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <i class="fas fa-bars text-gray-600 text-lg"></i>
                    </button>
                    <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
                </div>
                <div class="flex items-center space-x-4">
                   
                    <div class="flex items-center space-x-3">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-medium text-gray-800">{{ auth('admin')->user()->name }}</p>
                            <p class="text-xs text-gray-500">{{ auth('admin')->user()->email }}</p>
                        </div>
                        <div class="w-10 h-10 bg-gradient-to-br from-medicina-brand-500 to-medicina-brand-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white"></i>
                        </div>
                    </div>
                </div>
 </header>