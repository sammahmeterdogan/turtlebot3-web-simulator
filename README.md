# 🤖 TurtleBot3 Web Simülatörü

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