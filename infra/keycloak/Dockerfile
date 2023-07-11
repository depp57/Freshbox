# Custom optimized Keycloak Dockerfile https://www.keycloak.org/server/containers

# This first stage install curl inside the container, as it is removed since keycloak 21.0.0
# It is removed for security reasons, but I need curl for a simple healthcheck
# You SHOULD NOT use this method in production, it is better to use other healthcheck methods like Kubernetes tools
# https://www.keycloak.org/server/containers#_installing_additional_rpm_packages
FROM registry.access.redhat.com/ubi9 AS builder-curl
RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs jq curl \
    --releasever 9 --setopt install_weak_deps=false --nodocs -y; \
    dnf --installroot /mnt/rootfs clean all


FROM quay.io/keycloak/keycloak:21.1.2 AS builder
# Enable healthcheck
ENV KC_HEALTH_ENABLED=true
WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build


FROM quay.io/keycloak/keycloak:21.1.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY --from=builder-curl /mnt/rootfs /
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
