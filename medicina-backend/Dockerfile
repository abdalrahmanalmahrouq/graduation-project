FROM laravelsail/php82-composer

WORKDIR /var/www/html

# Install system packages and PHP extensions
# (This part is fine, leave it as is)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

# Copy project files
COPY . .

# We REMOVED "RUN composer install" from here.

# The new CMD will first install dependencies, THEN serve the application.
# The "sh -c" is important for running multiple commands.
CMD ["sh", "-c", "composer install && php artisan key:generate && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=8000"]