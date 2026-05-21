# How I turned an old laptop into a home server that secures my house

*A practical guide. Live version: [agamarora.com/lab/minibot](https://agamarora.com/lab/minibot/)*

---

## Why I built it

Every smart device in a modern home leaks. The TV pings ad networks every few seconds. The phone calls home. A cheap IoT bulb talks to a server you cannot trace. Family passwords sit in a service whose breach disclosure will arrive after the breach. Most households accept this because the only alternative on the shelf is a $300 firewall box from a company that may not exist in two years.

There is a quieter alternative sitting in almost every household: an old laptop in a drawer. It is already a Linux box. It already has a battery, a screen, a keyboard, and a disk. It just needs a job. Mine is now a home server that handles four jobs at once and draws about as much power as a phone charger.

### What it does

- **Blocks ads and malware on every device.** Pi-hole sits between the router and the internet and filters DNS for the whole house. The TV stops loading ads. The kids' tablets get fewer trackers. No per-device app to install.
- **Hosts the family password manager.** Vaultwarden runs locally and is reachable only through a private mesh (Tailscale). Same client apps as the commercial product. The vault lives on my disk.
- **Carries the same protection on the road.** Tailscale routes the family's phones through the home server even on cellular and hotel WiFi. The blocking follows the device.
- **Tells me when something is wrong.** A small Python bot pings every service every minute and messages me on Telegram if anything fails. Daily summary at 8 AM.

### The machine

The laptop I used is an AMD C-70 netbook from 2013. Slower than a modern phone, plenty fast for DNS lookups and a SQLite database. Yours can be older. The floor is a 64-bit CPU, 2 GB of RAM, and a working SSD.

| | |
|---|---|
| CPU | AMD C-70 dual-core 1.0 GHz |
| RAM | 3.6 GB |
| Disk | 120 GB SSD |
| Power | ~5W idle, ~15W peak |
| OS | Ubuntu Core 24 |
| Uptime | Lid closed, 24/7, since rebuild |

> *Most people throw the old laptop in a drawer because they think a server is something you buy. A server is a Linux box that does not turn off. The laptop in your drawer is already a Linux box. It just needs a job.*

---

## Safeguarding the home network is mostly DNS

Most of what people call "network security" at home reduces to four things, and three of them are DNS-shaped.

- **Block what ads and malware reach.** A network-wide DNS blocker stops the lookup before the device even tries to fetch the asset. Faster, quieter, cheaper than per-device filters.
- **Know what is on your network.** Pi-hole's query log shows which device talked to which domain and when. The fridge calling a server in Shenzhen at 3 AM stops being invisible.
- **Stop trusting random WiFi.** Tailscale carries the same blocking to phones on cellular and laptops on hotel WiFi. The protection follows the device, not the network.
- **Stop trusting password managers you do not run.** Vaultwarden is the open source Bitwarden server. Same client apps, your data on your disk, behind your tailnet, encrypted with your master password. A breach at the vendor is no longer your problem.

None of this needs a $300 firewall box. It needs a machine that does not turn off, a static IP, Docker, and an afternoon.

---

## The guide

Pick the laptop. Anything with a 64-bit CPU, 2 GB+ RAM, and a working battery good enough to ride out a flicker. Smaller is better. Older is fine. The C-70 in mine is from 2013 and still keeps up.

### 1. Install a server OS

Boot from a USB stick, install **[Ubuntu Server](https://ubuntu.com/download/server)** (or Ubuntu Core for a minimal footprint). Wired ethernet if the router is close enough. Otherwise WiFi works. Set a static IP on the router so the address never changes. Disable lid-suspend so closing the lid does not put it to sleep: `HandleLidSwitch=ignore` in `/etc/systemd/logind.conf`.

### 2. Lock down the door

Install `openssh-server`, `ufw`, `fail2ban`. UFW: deny all incoming, allow SSH from the LAN subnet only. Fail2Ban: ban after 3 failed SSH attempts. Install **[Tailscale](https://tailscale.com)** (free for personal use, 100 devices). Now you can SSH in from anywhere without opening port 22 to the internet.

### 3. Install Pi-hole

Install Docker. Run **[Pi-hole](https://pi-hole.net)** in `--network host` mode on port 53. In the router admin, change the DHCP DNS to the laptop's static IP. Every device on the network now resolves DNS through Pi-hole and inherits the blocklists. Add Tailscale's nameserver setting to push the same blocking to phones on cellular.

### 4. Install Vaultwarden

Run **[Vaultwarden](https://github.com/dani-garcia/vaultwarden)** in Docker, bound to `127.0.0.1:8080` only. Use **Tailscale Serve** to expose it inside the tailnet on an HTTPS URL like `https://minibot.your-tailnet.ts.net`. Install Bitwarden apps on phones and laptops, point them at that URL, enable 2FA on every account. Family password manager done. Never reachable from the public internet.

### 5. Wire up backups

Daily cron at 3 AM: SQLite safe-backup of the vault, GPG-encrypt the dump (AES-256, passphrase chmod 600), upload to a free cloud drive via **[rclone](https://rclone.org)**. Telegram alert on failure. For belt-and-suspenders, plug in an SD card with two rotating checkpoints written by another cron job. The same SD card has a `restore.sh` that rebuilds the whole stack on a fresh machine. Disaster recovery tested means disaster recovery that works.

### 6. Optional: a health bot

A small Python bot that loops over every service every 60s, checks DNS resolves, the Vaultwarden container is up, fail2ban has not banned the operator, the disk is not full. On any red, it messages Telegram. Daily summary at 8 AM. A status page on port 8788 makes it installable as a PWA on the phone. The home server tells you when it is sick instead of you discovering it the day you needed it.

---

## Questions you'd ask before starting

**Is this safe to run on my home internet?**
Yes, if you do not open any ports to the public internet. Tailscale handles remote access through an authenticated peer-to-peer overlay. The laptop itself only opens DNS on the LAN and SSH on the LAN. Nothing is exposed to the outside.

**My laptop is way older than yours. Will it work?**
Almost certainly. Pi-hole, Vaultwarden, and Tailscale together use under 500 MB of RAM at rest. A Core 2 Duo with 2 GB RAM and an SSD can run all three comfortably. The only hard floor is 64-bit (for current Docker images) and a working battery.

**What if the laptop dies?**
The SD card holds nightly backups plus a `restore.sh` that rebuilds the whole stack: pulls Docker images, restores Vaultwarden data, reinstalls cron and systemd units. Plug the SD card into any Linux machine and run the script. Up in about 20 minutes. The cloud copy is the second line of defense.

**Does this break any websites?**
Sometimes. Pi-hole is aggressive by default. The query log shows what was blocked, and whitelisting a domain is one command: `pihole allow example.com`. After a week of tuning the false-positive rate drops to near zero.

**Is hosting my family's passwords a good idea?**
Vaultwarden uses the same client-side AES-256 encryption as Bitwarden. Even if someone got the entire database, the passwords are unreadable without the master password. The DB lives behind your tailnet, on encrypted disk, with nightly encrypted backups. The risk profile is better than most consumer cloud password managers, not worse, because you control the threat surface.

**What about updates and maintenance?**
Once a week: `apt update && apt upgrade` and `docker pull` for each image. A single shell script handles it. The health bot pages you if anything is down. The first month is fiddly. After that it disappears into the background.

**How much electricity does it use?**
About 5 watts idle, occasionally peaking to 15 under load. At a typical residential rate, somewhere between $5 and $12 per year. Less than the streaming subscription you keep meaning to cancel.

**Why not buy a Raspberry Pi?**
A Pi 5 with a case, SD card, and power supply is around $100 by the time it works. The old laptop is $0 and has a built-in battery, screen, keyboard, and SSD. The laptop is the better deal until you run out of laptops.

**Where do I start if I have never touched Linux?**
Pick a quiet weekend. Install Ubuntu Server from a USB stick. The installer holds your hand. Skim the official [Pi-hole Docker docs](https://docs.pi-hole.net/main/docker/) and the [Vaultwarden wiki](https://github.com/dani-garcia/vaultwarden/wiki). Each tool's official docs are better than any third-party tutorial. Take your time. The first time is fiddly; the second time is an hour.

---

## The tools I used

Every link below is an official source. Each project has good docs. Read them. They are the durable reference; this guide is the map between them.

- [Ubuntu Server](https://ubuntu.com/download/server) — the base OS
- [Pi-hole](https://pi-hole.net) — network-wide DNS ad and malware blocker
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) — self-hosted Bitwarden server, family password manager
- [Tailscale](https://tailscale.com) — private mesh network, free for 100 devices
- [Docker](https://www.docker.com) — container runtime for every service above
- [go2rtc](https://github.com/AlexxIT/go2rtc) — local camera RTSP/WebRTC streamer
- [rclone](https://rclone.org) — encrypted cloud sync for backups
- [Fail2Ban](https://www.fail2ban.org) — auto-ban brute-force SSH attempts
- [UFW](https://help.ubuntu.com/community/UFW) — simple firewall for Ubuntu

---

*Originally published at [agamarora.com/lab/minibot](https://agamarora.com/lab/minibot/).*
