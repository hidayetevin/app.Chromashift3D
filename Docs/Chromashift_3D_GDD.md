# CHROMASHIFT 3D – GAME DESIGN DOCUMENT (GDD)
## Version 2.0 - COMPLETE EDITION

## 1. GENEL BAKIŞ
Chromashift 3D, Color Switch DNA'sını temel alan; **renk + şekil eşleşmesi** ve **dikey tema geçişi** yeniliğiyle ayrışan, tek parmakla oynanan hiper-casual bir mobil oyundur.

- **Tür:** Timing / Precision Casual
- **Platform:** Android 8.0+ & iOS 12+
- **Teknoloji:** Three.js + WebView / Wrapper
- **Hedef:** Yüksek retention + ödüllü reklam geliri
- **Target Kitle:** %85+ mobil pazar (modern cihazlar)

---

## 2. CORE GAMEPLAY LOOP
1. Top otomatik olarak zıplar (fizik tabanlı)
2. Engel aşağıdan yukarı gelir
3. Oyuncu ekrana dokunur
4. Top:
   - Renk değiştirir
   - Şekil değiştirir (0.2s morph animasyonu)
5. Engel ile eşleşme kontrolü:
   - Renk + şekil doğruysa → geçiş
   - Aksi halde → anında kayıp
6. Skor artar, hız yükselir
7. Ölüm → reklam / restart

---

## 3. KONTROLLER
- **Tek dokunuş (tap)**
- Swipe / hold yok
- Öğrenme süresi: Yok (deneyerek öğrenme)
- Responsive feedback: Haptic + SFX

---

## 4. RENK SİSTEMİ
### Aktif Renkler
- Kırmızı (#FF3B30)
- Mavi (#007AFF)
- Sarı (#FFCC00)
- Yeşil (#34C759)

### Kurallar
- Top ve engel renkleri eşleşmeli
- Renk değişimi:
  - Tap ile sırayla döngü (R→B→Y→G→R)
  - Checkpoint sonrası aynı renk korunur
- Renk değişiminde parlama efekti (Particle System)

### Para Birimi (Coins)
- Oyun içi para birimi "Coins" eklendi.
- Kazanma Yöntemleri:
  - Daily Login (7 Günlük döngü)
  - Video izleme (Optional)
- Kullanım Alanı:
  - İlerideki güncellemelerde Skin Unlock için kullanılacak.

---

## 5. ŞEKİL SİSTEMİ (ANA YENİLİK)
### Şekiller
- **Daire** (Circle)
- **Kare** (Square)
- **Üçgen** (Triangle)

### Kurallar
- Engel bir şekil ister
- Top aynı şekle sahip olmalı
- Renk doğru, şekil yanlışsa → fail

### Şekil Değişim Animasyonu
- **Süre:** 0.2 saniye
- **Tip:** Smooth morph (vertex interpolation)
- **VFX:** Hafif particle burst
- **SFX:** Kısa "pop" sesi

---

## 6. FİZİK SİSTEMİ
### Manuel Fizik Parametreleri
- **Gravity:** -9.8 m/s²
- **Bounce Yüksekliği:** 2.5 units
- **Bounce Süresi:** 0.8 saniye
- **Terminal Velocity:** -15 units/s
- **Lateral Movement:** Yok (sadece dikey)

### Bounce Pattern
```
Zıplama Döngüsü:
- Yükseliş: 0.4s (ease-out)
- İniş: 0.4s (ease-in)
- Toplam: 0.8s loop
```

---

## 7. COLLISION SİSTEMİ
### Collision Detection
- **Method:** Bounding Sphere (Three.js)
- **Player Hitbox:** radius * 0.8
- **Obstacle Hitbox:** segment bounds
- **Check Frequency:** Every frame (60 FPS)
- **Tolerance:** ±0.15 units

### Collision Logic
```javascript
if (collision detected) {
  if (player.color === obstacle.color) {
    if (player.shape === obstacle.shape) {
      SUCCESS → pass through
    } else {
      FAIL → game over (wrong shape)
    }
  } else {
    FAIL → game over (wrong color)
  }
}
```

### Edge Cases
- **İki engel arası sıkışma:** Daha önce geçtiği engel ignore edilir
- **Çok hızlı tap:** Debounce 0.1s (spam önleme)
- **Collision tam geçişte:** Son 0.2s'de collision ignore

---

## 8. CHECKPOINT SİSTEMİ
### Tanım
Checkpoint = Her 10. engel

### Özellikler
- Görsel: Altın renkte halka + particle effect
- SFX: Başarı sesi
- Fonksiyon: 
  - Güvenli geçiş noktası
  - Renk/şekil korunur
  - Hız artışı tetikleyici

### Checkpoint Görseli
- Dönen altın halka
- Pulsa animasyonu
- Geçerken "checkpoint reached" feedback

---

## 9. ENGEL TASARIMI
### Engel Tipleri
1. **Rotating Ring** (Döner Halka)
   - 4 segment (her renk 1)
   - Rotation speed: 60°/s (başlangıç)
   
2. **Shape Gate** (Şekil Kapısı)
   - Belirli şekil gerektirir
   - Renk + şekil kombinasyonu
   
3. **Narrow Tunnel** (Dar Geçit)
   - 2 segment seçenek
   - Yüksek precision gerektirir

4. **Mixed Combo** (Karma)
   - Renk + şekil + rotation
   - 60+ saniye sonra aktif

### Engel Spawn Kuralları
- İlk 3 engel: Sadece renk eşleşmesi
- 4+ engel: Renk + şekil aktif
- Aralık: Başlangıç 3 units, min 1.8 units
- Spawn hızı: Dinamik (player speed'e göre)

---

## 10. TEMA & ORTAM GEÇİŞLERİ
### Tema Akışı ve Skorlar

| Tema | Aktif Skor Aralığı | Ortam Özellikleri |
|------|-------------------|-------------------|
| **1. Grass & Sky** | 0-19 | Yeşil zemin, mavi gökyüzü, hafif bulutlar |
| **2. Cloud World** | 20-49 | Bulut platformları, beyaz/turkuaz renkler, soft fog |
| **3. Space** | 50-99 | Koyu uzay, yıldızlar, neon renkler, minimal fog |
| **4. Void** | 100-149 | Siyah/mor gradient, minimal lighting, yoğun fog |
| **5. Beyond Void** | 150+ | Psychedelic renkler, distortion, ultimate challenge |

### Tema Geçiş Mekanizması
- **Geçiş Süresi:** 3 saniye (smooth fade)
- **Lighting:** Lerp interpolation
- **Fog:** Yoğunluk değişimi
- **Arka Plan Rengi:** Gradient blend
- **SFX:** Tema geçiş sesi (whoosh + ambient)
- **Checkpoint Bağlantısı:** Tema geçişleri checkpoint'lerde tetiklenir

---

## 11. KAMERA
### Kamera Parametreleri
- **Tip:** Perspective Camera
- **FOV:** 60°
- **Position:** 
  - X: 0
  - Y: Player.y + 5 (smooth lerp)
  - Z: 12 (Base) - *Dynamic on Mobile (Responsive)*
- **LookAt:** Player position
- **Tilt:** 5° yukarı bakış
- **Responsiveness:**
  - Screen Width < Height (Portrait) ise Z mesafesi artar.
  - Hedef: Minimum 9 birim genişliği her zaman ekrana sığdırmak.

### Kamera Davranışları
- **Follow Speed:** Lerp(0.1) - yumuşak takip
- **Death Shake:** 0.3s, amplitude 0.5 units
- **Theme Transition:** Hafif zoom out (FOV 60→65, 1s)

---

## 12. ZORLUK EĞRİSİ
### Hız Artışı Formülü
```
Base Speed = 2 units/s
Speed Multiplier = 1.0 + (elapsed_time / 10) * 0.1
Max Speed Cap = 4.5 units/s

Örnek:
- 0s: 2.0 units/s
- 10s: 2.2 units/s (1.1x)
- 20s: 2.4 units/s (1.2x)
- 30s: 2.6 units/s (1.3x)
- 60s: 3.2 units/s (1.6x)
- 100s+: 4.5 units/s (CAP)
```

### Zorluk Katmanları
| Zaman | Aktif Mekanikler |
|-------|------------------|
| 0–10 sn | Sadece renk eşleşmesi, geniş boşluklar |
| 10–30 sn | Renk + şekil, rotation başlar |
| 30–60 sn | Hız artışı, dar geçitler |
| 60+ sn | Tema değişimi, kombine engeller, max hız |

### Rotation Speed Artışı
```
Base Rotation = 60°/s
Rotation Speed = 60 + (score / 20) * 15

Örnek:
- Skor 0: 60°/s
- Skor 20: 75°/s
- Skor 50: 97.5°/s
- Skor 100+: 120°/s (CAP)
```

---

## 13. SKOR & PROGRESYON
### Skor Sistemi
- **Skor Birimi:** Geçilen engel sayısı
- **Checkpoint Bonus:** +5 puan (her 10. engel)
- **Skor Gösterimi:** HUD'da büyük, net rakam
- **Best Score:** LocalStorage'da saklanır

### Tema Unlock Sistemi
- Tema 1 (Grass): Her zaman açık
- Tema 2 (Cloud): 20+ skor gerektirir
- Tema 3 (Space): 50+ skor gerektirir
- Tema 4 (Void): 100+ skor gerektirir

### Progression Indicators
- "Next Theme: 50" → HUD'da küçük gösterge
- "Best: 87" → Kişisel rekor
- Tema preview'ları main menu'de kilitli/açık

---

## 14. MONETİZASYON
### Rewarded Ad (Ana Gelir)
- **Tetikleme:** İlk ölüm
- **Teklif:** "Continue" butonu
- **Limit:** Run başına 1 kez
- **İkinci ölüm:** Direkt Game Over

### Interstitial Ad
- **Frekans:** Her 2-3 restart'ta 1
- **Timing:** 
  - Restart butonuna basıldığında
  - Ana menüye dönüşte
- **Asla:** Oyun sırasında gösterilmez

### Skin Unlock (Opsiyonel)
- Reklam izleyerek açılır
- Tema başına 2-3 reklam

---

## 15. SES & MÜZİK
### Müzik Sistemi
- **Ana Müzik:** Tek loop (ambient, minimal)
- **Tema Değişimi:** Filter modulation
  - Grass: Normal, hafif echo
  - Cloud: Reverb artışı
  - Space: Low-pass filter, synth vibe
  - Void: Heavy reverb, dark ambient

### SFX Listesi
| Event | Ses Efekti |
|-------|------------|
| Tap | Kısa "pop" |
| Shape Change | "Whoosh" + morph |
| Successful Pass | Hafif "ding" |
| Checkpoint | Başarı fanfare (0.5s) |
| Fail | Buzzer + crash |
| Theme Transition | Atmospheric whoosh (2s) |
| UI Button | Soft click |

### Ses Ayarları
- Müzik Volume: Default 0.6
- SFX Volume: Default 0.8
- Toggle On/Off: Settings menüsünde

---

## 16. ANALYTİCS & TRACKING
### Tracked Events
1. **Session Tracking**
   - `session_start` (timestamp, device_info)
   - `session_end` (duration, score)

2. **Death Analysis**
   - `player_death` (score, time, death_reason)
   - Death Reasons:
     - `wrong_color`
     - `wrong_shape`
     - `wrong_both`

3. **Progression**
   - `theme_reached` (theme_id, time_elapsed)
   - `checkpoint_passed` (checkpoint_number)

4. **Monetization**
   - `rewarded_ad_offered`
   - `rewarded_ad_watched`
   - `rewarded_ad_skipped`
   - `interstitial_shown`

5. **Retention Metrics**
   - Daily Active Users (DAU)
   - Average session duration
   - Run count per session

---

## 17. TEKNİK NOTLAR (Three.js)
### Performance Hedefleri
- **FPS:** 60 FPS (sabit)
- **Draw Calls:** Max 50/frame
- **Geometries:** Low poly (<500 vertices/object)
- **Object Pooling:** Engeller için 20 object pool

### Optimization Strategies
- Frustum culling aktif
- LOD kullanımı yok (geometriler zaten basit)
- Texture atlas (1024x1024 max)
- No dynamic shadows (baked lighting)

### Platform Gereksinimleri
- **Android:** 8.0+ (API Level 26)
- **iOS:** 12.0+
- **RAM:** 2GB minimum
- **GPU:** Mali-G71 / Adreno 505 veya üstü
- **Storage:** 50MB

---

## 18. UI/UX SİSTEMİ
### Ekranlar
1. **Main Menu**
   - Play butonu
   - Best Score gösterimi
   - Settings (ses, vibration)
   - Tema preview'ları

2. **In-Game HUD**
   - Skor (üst orta, büyük)
   - Next Theme indicator (üst sağ, küçük)
   - Minimal, oyunu bölmeyen

3. **Game Over**
   - Son skor
   - Best score
   - Continue (rewarded ad) - 1. ölüm
   - Restart
   - Home

### UI Kuralları
- Minimal, büyük dokunma alanları
- Okuma mesafesi: En az 1.5m
- Kontrast oranı: 4.5:1 minimum
- No text during gameplay (sadece rakamlar)

---

## 19. EDGE CASES & ERROR HANDLING
### Oyun İçi Edge Cases
1. **İki Engel Arası Sıkışma**
   - Son geçilen engel "passed" olarak işaretlenir
   - Collision ignore edilir

2. **Çok Hızlı Tap Spam**
   - 0.1s debounce timer
   - Her tap arası minimum 0.1s

3. **Network Kaybında Reklam**
   - Rewarded ad yüklenemezse → "Continue" butonu disable
   - Kullanıcıya "No connection" mesajı
   - Sadece Restart opsiyonu

4. **Collision Boundary Issues**
   - Player bounds clamp: X [-5, 5], Y [0, ∞]
   - Ekran dışı çıkışta auto game over

### Performance Edge Cases
1. **FPS Drop (<30)**
   - Particle effect'ler disable
   - Fog range azaltılır
   - Warning log: "Low performance mode"

2. **Memory Pressure**
   - Eski engeller pool'a geri dönüş hızlandırılır
   - Texture cache temizliği

### Tutorial System
- İlk açılışta oyuncuya temel mekanikleri öğretir.
- Adımlar:
  1. Renk Değişimi (Tap)
  2. Şekil Eşleşmesi
  3. Başarı Mesajı
- Durumu `SaveSystem` üzerinden takip edilir (`tutorial_completed`).

### Retention & Rewards
- **Daily Login Bonus:** 
  - Oyuncunun her gün giriş yapmasını teşvik eder.
  - Streak takibi yapılır (`login_streak`).
  - Ödül: Coins (veya 7. gün Skin/Special Reward).

---

## 20. BAŞARI KRİTERLERİ (KPI)
### Retention
- **D1 Retention:** %35+
- **D7 Retention:** %15+
- **Average Session:** 3–5 dakika

### Monetization
- **Rewarded Ad/User/Day:** 3+
- **Interstitial/User/Day:** 1-2
- **ARPDAU:** $0.05+

### Engagement
- **Average Run Duration:** 30-45 saniye
- **Runs per Session:** 8-12
- **Theme 2 Reach Rate:** %40+
- **Theme 3 Reach Rate:** %15+

---

## 21. MVP KAPSAMI
### Dahil Olanlar
- ✅ 1 oyun modu (endless)
- ✅ 4 tema + 1 bonus (Beyond Void)
- ✅ 3 şekil sistemi
- ✅ Full reklam entegrasyonu
- ✅ Analytics tracking
- ✅ Local high score

### Dahil Olmayanlar
- ❌ Multiplayer
- ❌ Daily challenges
- ❌ In-app purchases
- ❌ Leaderboard (global)
- ❌ Achievement sistemi

---

## 22. GELECEK GÜNCELLEMELER (POST-MVP)
### Phase 2 (1 ay sonra)
- Günlük görevler sistemi
- Global leaderboard
- Tema skin paketleri

### Phase 3 (2-3 ay sonra)
- Time Attack modu
- Endless+ (daha zor)
- Seasonal events

### Phase 4 (Opsiyonel)
- Ritim modu
- Multiplayer race
- Custom obstacle editor

---

## 23. TESTİ & QA KRİTERLERİ
### Test Cihazları
- **Android:**
  - Samsung Galaxy A50 (mid-range)
  - Google Pixel 4 (flagship)
  - Xiaomi Redmi Note 9 (budget)

- **iOS:**
  - iPhone 8 (minimum spec)
  - iPhone 12 (modern)
  - iPad 9th Gen (tablet)

### Kabul Kriterleri
- ✅ 60 FPS on mid-range devices
- ✅ No crash after 10 consecutive runs
- ✅ Ad loading success rate >95%
- ✅ Collision accuracy >99%
- ✅ Theme transition smooth (no frame drop)

---

## 24. DOSYA YAPISI
```
Chromashift3D/
├── src/
│   ├── core/
│   │   ├── Game.js (main game loop)
│   │   └── SceneManager.js
│   ├── game/
│   │   ├── PhysicsEngine.js (physics logic)
│   │   └── CollisionDetector.js (collision logic)
│   ├── player/
│   │   └── Player.js
│   ├── obstacles/
│   │   ├── ObstacleManager.js
│   │   ├── Obstacle.js
│   │   └── ObstaclePool.js
│   ├── environment/
│   │   ├── ThemeManager.js
│   │   └── CameraController.js
│   ├── ui/
│   │   └── UIManager.js
│   ├── audio/
│   │   └── AudioManager.js
│   ├── systems/
│   │   ├── ErrorHandler.js
│   │   ├── ParticleSystem.js
│   │   ├── RetentionSystem.js (Daily Login)
│   │   ├── SaveSystem.js
│   │   └── TutorialSystem.js
│   ├── monetization/
│   │   ├── AdsManager.js
│   │   └── RewardSystem.js
│   ├── analytics/
│   │   └── Analytics.js
│   ├── utils/
│   │   └── Constants.js
│   ├── index.html
│   ├── main.js
│   └── style.css
```

---

## 25. SONUÇ
Chromashift 3D, Color Switch'in başarılı mekaniklerini **şekil sistemi** ve **tema geçişleri** ile evrimleştirerek, retention ve monetizasyon dengesini optimize eden bir hyper-casual mobil oyundur.

**Başarı Formulü:**
- Öğrenme süresi: 0 saniye (deneyerek öğrenme)
- İlk run süresi: 20-40 saniye (optimal ad frequency)
- Tema geçişleri: Görsel progression hissi
- Rewarded ad: Organik kullanıcı kabulü
- Performance: 60 FPS garantisi

**Target Launch:** MVP 4-6 hafta içinde tamamlanabilir.

---

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
