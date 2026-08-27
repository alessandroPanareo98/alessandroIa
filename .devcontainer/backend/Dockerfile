FROM mcr.microsoft.com/devcontainers/java:1-21-bullseye

USER root

RUN rm -f /etc/apt/sources.list.d/yarn.list \
          /etc/apt/sources.list.d/yarnpkg.list \
    && apt-get update \
    && apt-get install --yes --no-install-recommends maven \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/msopenjdk-current
ENV PATH="${JAVA_HOME}/bin:${PATH}"

USER vscode