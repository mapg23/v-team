FROM mariadb:latest

# Copy optional configuration and init scripts
COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY init/ /docker-entrypoint-initdb.d/

# Copy dump import/export script
COPY import-export.sh /usr/local/bin/import-export.sh
RUN chmod +x /usr/local/bin/import-export.sh

# Copy the dumps folder
RUN mkdir -p /dumps
VOLUME ["/dumps"]

# Expose MariaDB port
EXPOSE 3306

# Volumes are defined in docker-compose.yml
VOLUME ["/var/lib/mysql", "/var/log/mysql"]

# MariaDB entrypoint handles startup automatically

ENTRYPOINT ["/usr/local/bin/import-export.sh"]
CMD ["mariadbd"]