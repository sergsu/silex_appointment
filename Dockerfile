FROM debian:stable

# Based on https://github.com/jcherqui/docker-silex/blob/master/Dockerfile

# Variables d'environnement
ENV DEBIAN_FRONTEND noninteractive
ENV INITRD No

RUN apt-get update --fix-missing

# Dependencies
RUN apt-get install -y nginx wget python curl bzip2 vim nano \
  php5 php5-fpm php5-mysql php5-imagick php5-curl php5-intl php-apc mysql-server acl adduser supervisor

# nginx
COPY nginx.conf /etc/nginx/sites-enabled/default

# start
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN sed -i -e "s/;daemonize\s*=\s*yes/daemonize = no/g" /etc/php5/fpm/php-fpm.conf
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-n"]

EXPOSE 80