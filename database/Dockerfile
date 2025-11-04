FROM mariadb:latest

# Copy optional configuration and init scripts
COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY init/ /docker-entrypoint-initdb.d/

# Expose MariaDB port
EXPOSE 3306

# Volumes are defined in docker-compose.yml
VOLUME ["/var/lib/mysql", "/var/log/mysql"]

# MariaDB entrypoint handles startup automatically