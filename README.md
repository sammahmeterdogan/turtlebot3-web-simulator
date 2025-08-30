
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/460a9cb9-f487-4668-abb7-a9e5ac10ae5f" />
<img width="2068" height="1259" alt="image" src="https://github.com/user-attachments/assets/6c0bb126-fff0-4f68-a123-72a518f4e5a7" />
<img width="2059" height="1029" alt="image" src="https://github.com/user-attachments/assets/c44db6cd-8281-44a6-ae0d-b083b0167500" />
 🤖 TurtleBot3 Web Simülatörü

**Terminal kullanmadan, tamamen web üzerinden TurtleBot3 robot simülasyonu ve kontrolü platformu**

## 📖 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Konfigürasyon](#-konfigürasyon)
- [Sorun Giderme](#-sorun-giderme)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## 🎯 Proje Hakkında

TurtleBot3 Web Simülatörü, robotik geliştiricilerin ve araştırmacıların terminal komutları ile uğraşmadan, tamamen web tarayıcısı üzerinden TurtleBot3 robotlarını simüle edebilmelerini ve kontrol edebilmelerini sağlayan profesyonel bir platformdur.

### Temel Amaç

- **Kullanım Kolaylığı**: Karmaşık ROS komutlarını bilmeden robot simülasyonu
- **Erişilebilirlik**: Herhangi bir cihazdan web tarayıcısı ile erişim
- **Eğitim Odaklı**: Robotik öğrenenler için ideal başlangıç platformu
- **Gerçek Zamanlı**: Canlı 3D görselleştirme ve kontrol
- **Kapsamlı**: TurtleBot3'ün tüm örneklerini içerir

## ✨ Özellikler

### 🎮 Simülasyon Kontrolü
- **Model Seçimi**: Burger, Waffle ve Waffle Pi modelleri arasında seçim
- **Tek Tıkla Başlatma**: Start/Stop butonları ile simülasyon kontrolü
- **Senaryo Yönetimi**: Hazır senaryolar (SLAM, Navigation, Teleoperation vb.)
- **Gerçek Zamanlı Durum**: Simülasyon durumu ve sistem sağlığı takibi

### 🗺️ Haritalama ve Navigasyon
- **SLAM**: Gerçek zamanlı haritalama (slam_toolbox)
- **Harita Kaydetme**: Oluşturulan haritaları PGM/YAML formatında kaydetme
- **Harita Yönetimi**: Kayıtlı haritaları listeleme, yükleme, silme
- **Otonom Navigasyon**: Nav2 ile hedef nokta belirleme ve navigasyon
- **Waypoint Navigasyonu**: Çoklu hedef noktaları ile rota planlama

### 🕹️ Robot Kontrolü
- **Teleoperation**: Klavye ve sanal joystick ile manuel kontrol
- **Hız Kontrolü**: Linear ve angular hız ayarları
- **Hassas Kontrol**: 8 yönlü hareket desteği
- **Acil Durdurma**: Anında durdurma butonu
- **Pozisyon Kontrolü**: Hassas pozisyon komutları

### 📊 Görselleştirme
- **3D Simülasyon**: Three.js tabanlı RViz benzeri görselleştirme
- **Sensör Verileri**: LaserScan, Odometry, IMU verileri
- **Kamera Akışı**: MJPEG formatında canlı kamera görüntüsü
- **Harita Görüntüleme**: OccupancyGrid harita gösterimi
- **Robot Modeli**: URDF tabanlı robot modeli görselleştirme
- **Path Görselleştirme**: Robot yolu ve planlanan rota gösterimi

### 📡 Telemetri ve Monitoring
- **Poz Takibi**: X, Y, Theta pozisyon bilgisi
- **Hız Göstergesi**: Linear ve angular hız değerleri
- **Batarya Durumu**: Batarya seviyesi takibi
- **CPU/Memory Kullanımı**: Sistem kaynak monitörü
- **Bağlantı Durumu**: ROS Bridge ve WebSocket durumu

### 💾 Veri Yönetimi
- **PostgreSQL Entegrasyonu**: Tüm veriler veritabanında saklanır
- **Session Yönetimi**: Simülasyon oturumları kaydı
- **Konfigürasyon Kayıtları**: Robot ayarları veritabanında
- **Flyway Migration**: Otomatik veritabanı şema yönetimi

## 🏗️ Sistem Mimarisi

### Backend (Spring Boot 3.2.0)

#### Teknoloji Stack
- **Java 17** - Temel programlama dili
- **Spring Boot 3.2.0** - Microservice framework
- **Spring Data JPA** - ORM ve veritabanı işlemleri
- **Spring WebSocket** - STOMP protokolü ile gerçek zamanlı iletişim
- **Spring Security** - Güvenlik katmanı (permit all konfigürasyonu)
- **PostgreSQL 15** - Ana veritabanı
- **Flyway 9.22.3** - Veritabanı migration yönetimi
- **MapStruct 1.5.5** - DTO-Entity mapping
- **Lombok** - Boilerplate kod azaltma
- **Docker Java Client 3.3.4** - Docker container yönetimi
- **Java-WebSocket 1.5.4** - ROS Bridge bağlantısı
- **SpringDoc OpenAPI 2.3.0** - Swagger UI ve API dokümantasyonu

#### Çok Katmanlı Mimari

```
backend/
├── rcp-base/                    # Temel modül
│   └── src/main/java/com/samma/rcp/base/
│       ├── controller/          # BaseController abstract sınıfı
│       ├── dto/                 # RequestDTO, ResponseDTO base sınıfları
│       ├── mapper/              # BaseMapper interface
│       └── service/             # BaseService interface ve implementasyonu
│
└── rcp-app/                     # Ana uygulama modülü
    └── src/main/java/com/samma/rcp/app/
        ├── config/              # Konfigürasyon sınıfları
        │   ├── WebConfig        # CORS ve Web ayarları
        │   ├── SecurityConfig   # Spring Security (permit all)
        │   ├── OpenApiConfig    # Swagger/OpenAPI
        │   └── RosDockerProps   # ROS ve Docker properties
        │
        ├── controller/          # REST API Controller'ları
        │   ├── SimulationController    # Simülasyon yönetimi
        │   ├── MapController           # Harita işlemleri
        │   ├── ExampleController       # Hazır senaryolar
        │   └── TeleopController        # Robot kontrolü
        │
        ├── domain/              # Domain katmanı
        │   ├── entity/          # JPA Entity'leri
        │   │   ├── RobotConfig         # Robot konfigürasyonu
        │   │   ├── SimulationSession   # Simülasyon oturumu
        │   │   ├── SavedMap            # Kaydedilmiş haritalar
        │   │   └── ExampleScenario     # Örnek senaryolar
        │   │
        │   ├── model/           # Enum ve model sınıfları
        │   │   ├── RobotModel          # BURGER, WAFFLE, WAFFLE_PI
        │   │   ├── ScenarioType        # TELEOP, SLAM, NAVIGATION vb.
        │   │   └── SimulationStatus    # RUNNING, STOPPED, ERROR vb.
        │   │
        │   └── repo/            # Spring Data JPA Repository'leri
        │       ├── RobotConfigRepository
        │       ├── SimulationSessionRepository
        │       └── SavedMapRepository
        │
        ├── dto/                 # Data Transfer Object'leri
        │   ├── RobotConfigDTO
        │   ├── SimulationStartRequest
        │   ├── SimulationStatusDTO
        │   ├── SavedMapDTO
        │   ├── GoalPoseDTO              # Navigasyon hedefi
        │   └── TwistDTO                 # Hız komutları
        │
        ├── mapper/              # MapStruct Mapper'ları
        │   ├── MapStructConfig
        │   ├── RobotConfigMapper
        │   └── SavedMapMapper
        │
        ├── orchestration/       # Docker ve ROS yönetimi
        │   ├── DockerService            # Docker compose up/down
        │   ├── RosBridgeClient          # ROS WebSocket bağlantısı
        │   ├── SimulationOrchestrator   # Simülasyon lifecycle
        │   └── RosCommandGateway        # ROS komut gönderimi
        │
        ├── service/             # İş mantığı servisleri
        │   ├── SimulationService        # Simülasyon işlemleri
        │   ├── MapService               # Harita kaydetme/yükleme
        │   ├── RobotConfigService       # Robot konfigürasyonu
        │   └── TeleopService            # Teleoperation servisi
        │
        └── ws/                  # WebSocket handler
            └── RobotSocketHandler       # STOMP WebSocket

```

### Frontend (React 18.3.1 + Vite)

#### Teknoloji Stack
- **React 18.3.1** - UI framework
- **Vite 5.4.10** - Build tool ve dev server
- **Three.js 0.169.0** - 3D görselleştirme
- **@react-three/fiber 8.17.10** - React Three.js entegrasyonu
- **@react-three/drei 9.114.3** - Three.js yardımcı bileşenleri
- **ROSLIB 1.3.0** - ROS Bridge JavaScript client
- **@stomp/stompjs 7.0.0** - WebSocket STOMP client
- **React Router 6.26.0** - Sayfa yönlendirme
- **@tanstack/react-query 5.59.0** - Sunucu state yönetimi
- **Zustand 4.5.5** - Client state yönetimi
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Framer Motion 11.11.11** - Animasyon kütüphanesi
- **Lucide React 0.453.0** - İkon kütüphanesi
- **React Hook Form 7.53.0** - Form yönetimi
- **React Hot Toast 2.4.1** - Bildirim sistemi
- **Recharts 2.12.7** - Grafik kütüphanesi

#### Dosya Yapısı

```
frontend/
├── src/
│   ├── services/                # API ve WebSocket servisleri
│   │   ├── api.js               # REST API çağrıları (axios)
│   │   ├── rosClient.js         # ROS Bridge bağlantısı (ROSLIB)
│   │   └── ws.js                # STOMP WebSocket yönetimi
│   │
│   ├── components/
│   │   ├── layout/              # Sayfa düzeni bileşenleri
│   │   │   ├── Layout.jsx       # Ana layout wrapper
│   │   │   ├── Sidebar.jsx      # Sol menü (navigasyon, bağlantı durumu)
│   │   │   ├── Topbar.jsx       # Üst bar (arama, bildirimler)
│   │   │   └── PageContainer.jsx # Sayfa container wrapper
│   │   │
│   │   ├── simulation/          # Simülasyon bileşenleri
│   │   │   ├── RvizPanel.jsx    # 3D görselleştirme (Three.js)
│   │   │   ├── TeleopPad.jsx    # Robot kontrol pad'i
│   │   │   ├── ModelSelector.jsx # Robot model seçici
│   │   │   ├── ScenarioSelector.jsx # Senaryo seçici
│   │   │   └── StatusPanel.jsx  # Durum gösterge paneli
│   │   │
│   │   └── ui/                  # Genel UI bileşenleri
│   │       └── LoadingSpinner.jsx
│   │
│   ├── pages/                   # Sayfa bileşenleri
│   │   ├── Dashboard.jsx        # Ana sayfa (istatistikler, hızlı erişim)
│   │   ├── Simulator.jsx        # Simülasyon kontrol sayfası
│   │   ├── Examples.jsx         # Hazır senaryolar
│   │   ├── Maps.jsx             # Harita yönetimi
│   │   ├── Settings.jsx         # Ayarlar sayfası
│   │   └── NotFound.jsx         # 404 sayfası
│   │
│   ├── styles/
│   │   └── index.css            # Tailwind CSS ve özel stiller
│   │
│   ├── App.jsx                  # Ana uygulama bileşeni ve routing
│   └── main.jsx                 # Uygulama entry point
│
├── public/                      # Statik dosyalar
├── index.html                   # HTML template
├── vite.config.js              # Vite konfigürasyonu
├── tailwind.config.js          # Tailwind CSS ayarları
├── postcss.config.js           # PostCSS ayarları
└── package.json                # Bağımlılıklar ve scriptler
```

### API Endpoint'leri

#### Simülasyon Yönetimi
```
POST   /api/sim/start              # Simülasyon başlatma
POST   /api/sim/stop               # Simülasyon durdurma
GET    /api/sim/status             # Durum sorgulama
```

#### Harita İşlemleri
```
POST   /api/map/save               # Harita kaydetme
GET    /api/map/list               # Harita listesi
POST   /api/map/load/{id}          # Harita yükleme
DELETE /api/map/{id}               # Harita silme
```

#### Robot Kontrolü
```
POST   /api/teleop/twist           # Hız komutu gönderme
POST   /api/nav/goal               # Navigasyon hedefi
POST   /api/nav/waypoints          # Çoklu hedef noktası
GET    /api/nav/status             # Navigasyon durumu
```

#### SLAM İşlemleri
```
POST   /api/slam/start             # SLAM başlatma
POST   /api/slam/stop              # SLAM durdurma
GET    /api/slam/status            # SLAM durumu
```

#### Örnek Senaryolar
```
GET    /api/examples               # Tüm senaryolar
POST   /api/examples/{id}/launch   # Senaryo başlatma
```

#### Konfigürasyon
```
GET    /api/config/models          # Robot modelleri
GET    /api/config                 # Konfigürasyon listesi
POST   /api/config                 # Yeni konfigürasyon
PUT    /api/config/{id}            # Konfigürasyon güncelleme
```

### WebSocket Topics

```
/topic/status                      # Simülasyon durumu
/topic/pose                        # Robot pozisyonu
/topic/telemetry                   # Telemetri verileri
/topic/battery                     # Batarya durumu
/topic/map-meta                    # Harita metadata
```

### Veritabanı Şeması (PostgreSQL)

```sql
-- Robot konfigürasyonları
robot_config (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Simülasyon oturumları
simulation_session (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR(50),
    scenario VARCHAR(100),
    status VARCHAR(50),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    ros_bridge_url VARCHAR(255),
    video_url VARCHAR(255)
)

-- Kaydedilmiş haritalar
saved_map (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    file_path VARCHAR(500),
    size_mb DOUBLE,
    resolution DOUBLE,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP
)

-- Örnek senaryolar
example_scenario (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE,
    title VARCHAR(255),
    description TEXT,
    launch_args TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    enabled BOOLEAN
)
## 🚀 Hızlı Kurulum (Clone Eden Kişiler İçin)

### Ön Gereksinimler

#### 1. Node.js 18+ Kurulumu (Ubuntu/Linux)
```bash
# Node.js versiyonunu kontrol edin
node --version  # 18+ olmalı

# Eğer eski versiyon varsa:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Alternatif: nvm kullanın
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 2. Java 17+ Kurulumu
```bash
# Java versiyonunu kontrol edin
java --version  # 17+ olmalı

# Ubuntu'da Java 17 kurulumu
sudo apt update
sudo apt install openjdk-17-jdk

# JAVA_HOME ayarlayın
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

#### 3. Docker Kurulumu (Opsiyonel)
```bash
# Docker kurulumu
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# Yeniden giriş yapın veya newgrp docker çalıştırın
```

### Projeyi Clone Etme ve Başlatma

#### Tek Komutla Kurulum
```bash
# Projeyi clone et
git clone <repository-url>
cd turtlebot3-web-simulator

# Frontend kurulumu ve başlatma
cd frontend
npm install
npm run dev
```

#### Backend Kurulumu (Development Mode)
```bash
# Başka bir terminal açın
cd backend

# H2 veritabanı ile development mode (PostgreSQL kurulum gerektirmez)
./gradlew bootRun --args='--spring.profiles.active=dev'
```

#### Production Mode (Docker ile)
```bash
# Root dizinde
docker-compose up --build
```

### Erişim URL'leri

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Database Console** (dev mode): http://localhost:8080/h2-console

### ROS Bridge Bağlantısı

ROS Bridge WebSocket sunucusu otomatik olarak Docker ile başlatılır. Manuel başlatmak için:

```bash
# ROS Noetic ile
roslaunch rosbridge_server rosbridge_websocket.launch

# Docker ile
docker run -p 9090:9090 local/rosbridge:humble
```

## 🔧 Sorun Giderme

### Sık Karşılaşılan Sorunlar

#### 1. Node.js Versiyon Hatası
```bash
# Hata: "Unexpected token '.'"
# Çözüm: Node.js 18+ güncelleyin
```

#### 2. Frontend Bağlantı Sorunu
```bash
# Hata: "WebSocket connection failed"
# Çözüm: Backend'in çalıştığından emin olun
curl http://localhost:8080/api/sim/status
```

#### 3. ROS Bridge Bağlantı Sorunu
```bash
# Hata: "ROS Bridge disconnected"
# Çözüm: ROS Bridge servisini kontrol edin
docker ps | grep rosbridge
```

#### 4. Database Bağlantı Sorunu
```bash
# Development mode kullanın (H2 in-memory database)
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Log Kontrolü

#### Frontend Logs
```bash
# Browser console (F12)
# Veya terminal'de:
cd frontend && npm run dev
```

#### Backend Logs
```bash
# Terminal'de:
cd backend && ./gradlew bootRun

# Docker ile:
docker logs turtlebot3-backend
```

### Port Kullanımı

| Servis | Port | Açıklama |
|--------|------|----------|
| Frontend | 5173 | Development server |
| Backend | 8080 | Spring Boot API |
| ROS Bridge | 9090 | WebSocket server |
| PostgreSQL | 5432 | Database |
| Frontend (Prod) | 3000 | Docker production |

### Development vs Production

#### Development Mode (Önerilen)
```bash
# Terminal 1: Backend (H2 database)
cd backend && ./gradlew bootRun --args='--spring.profiles.active=dev'

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: ROS Bridge (opsiyonel)
docker run -p 9090:9090 local/rosbridge:humble
```

#### Production Mode
```bash
# Tek komut - tüm sistemi başlatır
docker-compose up --build
```

### İlk Çalıştırma Kontrol Listesi

- [ ] Node.js 18+ kurulu
- [ ] Java 17+ kurulu
- [ ] Frontend dependencies yüklendi (`npm install`)
- [ ] Backend başarıyla compile oldu (`./gradlew build`)
- [ ] Frontend erişilebilir (http://localhost:5173)
- [ ] Backend API yanıtlıyor (http://localhost:8080/api/sim/status)
- [ ] ROS Bridge bağlantısı kuruldu
- [ ] Dashboard sayfası yükleniyor
- [ ] Simulator sayfası 3D görselleştirme gösteriyor

### Hızlı Test

```bash
# 1. Backend test
curl http://localhost:8080/api/sim/status

# 2. Frontend test
# Browser'da http://localhost:5173 açın
# Dashboard sayfasından Simulator'a gidin
# "Start Simulation" butonuna tıklayın

# 3. WebSocket test
# Browser console'da ROS Bridge bağlantısını kontrol edin
```

## 🤝 Geliştirici Notları

### Kod Değişiklikleri Sonrası

```bash
# Frontend hot reload otomatik
# Backend için restart gerekli:
cd backend && ./gradlew bootRun
```

### Debug Mode

```bash
# Backend debug mode
./gradlew bootRun --debug-jvm

# Frontend debug
npm run dev -- --debug
```

Bu adımları takip ederek proje 5 dakikada çalışır hale gelecektir.
