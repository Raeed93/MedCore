# Certbot renewal hooks

Certbot uses the standalone plugin, which binds port 80 — already held by
pulse-nginx-1. These hooks stop nginx, renew, copy certs into ~/pulse/certs/
(bind-mounted by nginx), and restart nginx.

## Install on a new host
    sudo mkdir -p /etc/letsencrypt/renewal-hooks/{pre,deploy,post}
    sudo cp pre/*.sh    /etc/letsencrypt/renewal-hooks/pre/
    sudo cp deploy/*.sh /etc/letsencrypt/renewal-hooks/deploy/
    sudo cp post/*.sh   /etc/letsencrypt/renewal-hooks/post/
    sudo chmod +x /etc/letsencrypt/renewal-hooks/*/*.sh

## Verify
    sudo certbot renew --dry-run
Deploy hooks do NOT run during dry-run. Test that one directly:
    sudo /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh

## Incident 2026-08-02
Renewal failed silently for ~5 weeks (port 80 conflict with nginx container).
Cert expired 2026-07-26. Certs in ~/pulse/certs/ were stale manual copies from
April, so even a successful renewal would not have reached nginx.
Detection gap was the real failure — nothing alerted.
