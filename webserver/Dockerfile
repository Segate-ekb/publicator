FROM alpine:latest as downloader

ARG ONEC_USERNAME
ARG ONEC_PASSWORD
ARG ONEC_VERSION
ENV installer_type=server
ENV downloads=downloads/platform83/${ONEC_VERSION}
ENV RAS_PORT=1545
ENV RAS_CLUSTER_ADDRESS=''
ENV SRV1CV8_KEYTAB=/opt/1cv8/x86_64/${ONEC_VERSION}/usr1cv8.keytab
ENV SRV1CV8_PORT=1540
ENV SRV1CV8_REGPORT=1541
ENV SRV1CV8_RANGE=1560:1591
ENV SRV1CV8_DEBUG=-debug
ENV SRV1CV8_DATA=/home/usr1cv8/.1cv8/1C/1cv8
ENV SRV1CV8_SECLEV=0
ENV SRV1CV8_PINGPERIOD=1000
ENV SRV1CV8_PINGTIMEOUT=5000

COPY ./webserver/scripts/download_og.sh /download_og.sh

WORKDIR /tmp
COPY ./webserver/distr ./${downloads}
RUN rm ./${downloads}/.gitkeep 
RUN rm -rf ${downloads}/thin.client*.tar.gz
RUN rm -rf ${downloads}/client*.tar.gz
RUN rm -rf ${downloads}/1c_edt*.tar.gz
RUN if [ -z "$(ls -A ${downloads})" ]; then \
  apk --no-cache add bash curl grep tar \
  && set -x \
  && sync; /download_og.sh; \
  fi
RUN  rm -rf ${downloads}/*thin*.tar.gz
#RUN ls ${downloads} \
#  && for file in ${downloads}/*.tar.gz; do \
#  tar -xzf "$file" ; done
RUN tar -xzf ${downloads}/${ONEC_VERSION}.tar.gz
RUN rm -rf ${downloads}/*.*

FROM ubuntu:20.04 as base

# Указываем рабочий каталог и копируем конфигурационный файл раскладки
WORKDIR /opt/1c-server/
ADD ./webserver/selections.conf ./selections.conf
# Устанавливаем первый пакет зависимостей
RUN apt-get update && apt-get install -yq procps tzdata debconf-utils curl fontconfig unixodbc ttf-mscorefonts-installer libgsf-1-114 keyboard-configuration
# Настраиваем временную зону и раскладку клавиатуры (иначе повиснем на процессе установки)
RUN ln -fs /usr/share/zoneinfo/Europe/Moscow /etc/localtime && debconf-set-selections < selections.conf
RUN dpkg-reconfigure -f noninteractive tzdata
RUN dpkg-reconfigure -f noninteractive keyboard-configuration
# Устанавливаем оставшиеся зависимости
RUN apt-get install -yq geoclue-2.0 gstreamer1.0-plugins-bad
# Правим локаль на русскую
RUN export LANG=ru_RU.UTF-8

ARG ONEC_VERSION
ENV installer_type=server
ARG gosu_ver=1.11
ARG nls_enabled=false
ENV nls=$nls_enabled

COPY ./webserver/scripts/install.sh /install.sh
COPY --from=downloader /tmp/*.* /tmp/
WORKDIR /tmp

SHELL ["/bin/bash", "-c"]
RUN ls . \
  && chmod +x /install.sh \
  && sync; /install.sh

# create symlink to current 1c:enterprise directory
COPY ./webserver/scripts/create-symlink-to-current-1cv8.sh /create-symlink-to-current-1cv8.sh
RUN chmod +x /create-symlink-to-current-1cv8.sh \
  && /create-symlink-to-current-1cv8.sh \
  && rm /create-symlink-to-current-1cv8.sh

ADD https://github.com/tianon/gosu/releases/download/$gosu_ver/gosu-amd64 /bin/gosu

RUN chmod +x /bin/gosu

FROM httpd:2.4

ARG onec_uid="999"
ARG onec_gid="999"

COPY --from=base /opt /opt
COPY --from=base /bin/gosu /bin/gosu

RUN set -xe \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      locales \
      imagemagick \
      fontconfig \
  && rm -rf \
    /var/lib/apt/lists/* \
    /var/cache/debconf \
  && localedef -i ru_RU -c -f UTF-8 -A /usr/share/locale/locale.alias ru_RU.UTF-8
ENV LANG ru_RU.UTF-8

RUN groupadd -r grp1cv8 --gid=$onec_gid \
  && useradd -r -g grp1cv8 --uid=$onec_uid --home-dir=/home/usr1cv8 --shell=/bin/bash usr1cv8 \
  && mkdir -p /var/log/1C /home/usr1cv8/.1cv8/1C/1cv8/conf /opt/1cv8/current/conf \
  && chown -R usr1cv8:grp1cv8 /var/log/1C /home/usr1cv8

ARG MONO_VERSION=6.12.0.122

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      ca-certificates \
      gnupg \
      dirmngr \
      wget \
  && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
  && echo "deb http://download.mono-project.com/repo/debian stable-buster main" > /etc/apt/sources.list.d/mono-official-stable.list \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
    mono-runtime \
    ca-certificates-mono \
    libmono-i18n4.0-all \
    libmono-system-runtime-serialization4.0-cil \
  && rm -rf /etc/apt/sources.list.d/mono-official-stable.list \
  && apt-get update \
  && cert-sync --user /etc/ssl/certs/ca-certificates.crt \
  && rm -rf  \
    /var/lib/apt/lists/* \
    /var/cache/debconf \
    /tmp/*

# Installing oscript
ARG OVM_REPOSITORY_OWNER=oscript-library
ARG OVM_VERSION=v1.0.0-RC16
ARG ONESCRIPT_VERSION=stable
ARG ONESCRIPT_PACKAGES="autumn winow json autumn-logos"

RUN wget https://github.com/${OVM_REPOSITORY_OWNER}/ovm/releases/download/${OVM_VERSION}/ovm.exe \
  && mv ovm.exe /usr/local/bin/ \
  && echo 'mono /usr/local/bin/ovm.exe "$@"' | tee /usr/local/bin/ovm \
  && chmod +x /usr/local/bin/ovm \
  && ovm use --install ${ONESCRIPT_VERSION}

ENV OSCRIPTBIN=/root/.local/share/ovm/current/bin
ENV PATH="$OSCRIPTBIN:$PATH"

# Update and prepare oscript packages
RUN opm install opm \
  && opm update --all \
  && opm install ${ONESCRIPT_PACKAGES}

COPY ./webserver/docker-entrypoint.sh /winow/
COPY ./webserver/app /opt/app/winow/ 

RUN chmod 755 /winow/docker-entrypoint.sh \
  && chmod +x /winow/docker-entrypoint.sh

ENTRYPOINT ["/winow/docker-entrypoint.sh"]

EXPOSE 80
EXPOSE 3333
