import './bootstrap';



        // Set current date
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

        // Toggle sidebar
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleButton = document.getElementById('toggle-sidebar');

        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-expanded');
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('content-expanded');
            mainContent.classList.toggle('content-collapsed');
            
            // Update button icon
            const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
            toggleButton.innerHTML = isCollapsed ? 
                '<i class="fas fa-bars text-gray-600 text-lg"></i>' : 
                '<i class="fas fa-times text-gray-600 text-lg"></i>';
        });

        // Handle responsive behavior
        function handleResize() {
            const isMobile = window.innerWidth < 768;
            const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
            
            if (isMobile && !isCollapsed) {
                sidebar.classList.add('sidebar-collapsed');
                sidebar.classList.remove('sidebar-expanded');
                mainContent.classList.add('content-collapsed');
                mainContent.classList.remove('content-expanded');
                toggleButton.innerHTML = '<i class="fas fa-bars text-gray-600 text-lg"></i>';
            } else if (!isMobile && isCollapsed) {
                sidebar.classList.remove('sidebar-collapsed');
                sidebar.classList.add('sidebar-expanded');
                mainContent.classList.remove('content-collapsed');
                mainContent.classList.add('content-expanded');
                toggleButton.innerHTML = '<i class="fas fa-times text-gray-600 text-lg"></i>';
            }
        }

        // Initialize
        window.addEventListener('load', handleResize);
        window.addEventListener('resize', handleResize);
    