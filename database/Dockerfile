FROM mariadb:latest

COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY initdb/ /docker-entrypoint-initdb.d/

EXPOSE 3306
VOLUME ["/var/lib/mysql", "/var/log/mysql"]

# Default MariaDB entrypoint handles the import logic
