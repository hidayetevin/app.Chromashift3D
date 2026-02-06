# CHROMASHIFT 3D – GAME DESIGN DOCUMENT (GDD)
## Version 2.1 - UPDATED EDITION (Physics & Sync Fixes)

## 1. GENEL BAKIŞ
Chromashift 3D, Color Switch DNA'sını temel alan; **renk + şekil eşleşmesi** ve **dikey fizik tabanlı zıplama** mekaniğiyle ayrışan, tek parmakla oynanan hiper-casual bir mobil oyundur.

- **Tür:** Timing / Precision Casual
- **Platform:** Android 8.0+ & iOS 12+
- **Teknoloji:** Three.js + Vite
- **Hedef:** Yüksek retention + ödüllü reklam geliri

---

## 2. CORE GAMEPLAY LOOP
1. Top yerçekimi etkisiyle düşer.
2. Oyuncu ekrana dokunur (Tap) -> Top yukarı zıplar (Jump).
3. Engeller dikey doğrultuda dizilir.
4. Oyuncu "Renk Değiştirici" (Color Switcher) içinden geçer:
   - Topun rengi değişir.
   - Renk değişimi görsel bir "Pulse" efekti (1.2s) ile desteklenir.
5. Engel ile eşleşme kontrolü:
   - Renk eşleşiyorsa → geçiş.
   - Yanlış renk → anında kayıp (Game Over).
6. **Güvenli Alan (Safe Area):** 
   - Top ekranın altına düşerse veya çok üstüne çıkarsa → Game Over.
7. Skor artar, engellerin dönme hızı yükselir.

---

## 3. KONTROLLER
- **Tek dokunuş (tap):** Zıplama (Jump).
- **Renk/Şekil Değişimi:** Pasif (Switcher engelleri ile yapılır).
- Kamera sadece yukarı takip eder (Düşerken sabit kalır).

---

## 4. RENK SİSTEMİ
### Aktif Renkler
- Kırmızı (0xFF3B30)
- Mavi (0x007AFF)
- Sarı (0xFFCC00)
- Yeşil (0x34C759)

### Kurallar
- Top rengi, geçtiği engelin o anki segmentiyle eşleşmeli.
- **Senkronizasyon:** Color Switcher'lar, bir sonraki engelin rengini önceden belirler ve oyuncuyu o renge dönüştürür.
- Renk değişiminde genişleyen, opaklığı azalan küre efekti (1.2s sürer).

---

## 5. ŞEKİL SİSTEMİ
### Şekiller
- **Daire** (Circle)
- **Kare** (Square)
- **Üçgen** (Triangle)
- **Beşgen** (Pentagon)

### Kurallar
- Bazı engeller (Beşgen, Üçgen, Pervane) **"Çift Kapı"** kuralını kullanır: Yan yana iki segment oyuncu rengiyle aynı olur (Geçiş kolaylığı için).
- Diğer engeller (Halka, Kare, Çember) 4 rengi de rastgele içerir.

---

## 6. FİZİK SİSTEMİ
### Manuel Fizik Parametreleri
- **Gravity:** -20 m/s² (Snappy/hızlı hissiyat)
- **Bounce Height:** 2.0 units
- **Terminal Velocity:** -25 units/s
- **Safe Area:** Kamera odağından ±8.5 birim sapma toleransı.

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
1. **Rotating Ring** (Döner Halka) - 4 segment.
2. **Square** (Kare) - 4 segment.
3. **Triangle / Pentagon** - Kapalı geometrik halkalar.
4. **Fan** (Pervane) - 3 Kanatlı (2'si oyuncu renginde).
5. **Sliding Bar** (Kayan Çubuklar) - Yatay hareket eden 4 renkli şerit.
6. **Double Circles** (İkili Çemberler) - Kesişim noktaları senkronize dönen halkalar.

### Spawn Kuralları
- Renk Değiştirici: Her 3-7 engel arasında rastgele bir aralıkla (threshold) spawn olur.
- Hız: `50 + (score * 2)`.

---

## 10. TEMA & ORTAM GEÇİŞLERİ
- **Tema:** Sabitlendi. Oyun boyunca **"Neon Dark"** teması hakimdir.
- **Atmosfer:** Karanlık arka plan, neon parlayan engeller ve oyuncu.

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
- **Takip:** Sadece YUKARI (Math.max). Top düşerken kamera en son yüksekliğinde sabit kalır.
- **Görüş:** Minimum 9 birim genişliği her zaman kapsayacak şekilde dinamik Z mesafesi.
- **Shake:** Ölüm anında 0.3s sarsıntı.

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
