# CHROMASHIFT 3D – MONETIZATION & RETENTION PLAN
## Version 2.0 - COMPLETE EDITION

## 1. GENEL STRATEJİ
Chromashift 3D için monetizasyon stratejisi, **oyunu bölmeden**, oyuncunun doğal akış içinde reklamı kabul etmesini hedefler.

Ana gelir kaynağı:
- **Rewarded Ads** (Primary Revenue)

Destekleyici gelir:
- **Interstitial Ads** (Secondary Revenue)

In-App Purchase zorunlu değildir (MVP'de yok).

### Hedef Metrikler
- ARPDAU: $0.05+
- Ad fill rate: >95%
- Rewarded ad completion rate: >80%

---

## 2. REWARDED AD SİSTEMİ (ANA GELİR)

### 2.1 Ne Zaman Gösterilir?
- Oyuncu öldüğünde (ilk ölüm)
- Game Over ekranında ilk seçenek olarak
- **Asla:** İkinci ölümde gösterilmez

### 2.2 Game Over Ekranı Butonları
```
┌─────────────────────────────┐
│      GAME OVER              │
│      Score: 47              │
│      Best: 89               │
│                             │
│  ┌─────────────────────┐   │
│  │  ▶️ CONTINUE         │   │ ← Rewarded Ad (1. ölüm)
│  │  (Watch Ad)         │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔁 RESTART         │   │ ← Interstitial (her 2-3)
│  └─────────────────────┘   │
│                             │
│  🏠 HOME                    │
└─────────────────────────────┘
```

### 2.3 Reklam İzleyince Ne Olur? (DETAYLI MEKANİZMA)

#### Continue Sequence (3 Aşama)
```javascript
// AŞAMA 1: AD COMPLETION (Reklam bitişi)
- Ekran fade to black (0.3s)
- "Continuing..." text appear

// AŞAMA 2: RESPAWN SETUP (Respawn hazırlığı)
- Player aynı pozisyonda spawn
- Player aynı renk ile spawn
- Player aynı şekil ile spawn
- Son geçilen 2 engel silinir
- Sonraki engeller 2 saniye freeze (donma)

// AŞAMA 3: RESUME (Devam)
- Engeller yavaş hareket başlar (0→normal speed, 2s)
- Player kontrolü aktif
- "GO!" göstergesi (1s)
- Game loop devam
```

#### Teknik Detaylar
```javascript
onRewardedAdComplete() {
  // 1. Oyun durumunu kaydet
  const savedState = {
    playerY: player.position.y,
    playerColor: player.currentColor,
    playerShape: player.currentShape,
    score: currentScore,
    speed: currentSpeed
  };
  
  // 2. Son geçilen 2 engeli kaldır
  removeLastPassedObstacles(2);
  
  // 3. Sonraki engelleri dondur
  freezeUpcomingObstacles(duration: 2.0);
  
  // 4. Player'ı respawn et
  player.respawn(savedState);
  
  // 5. Yumuşak başlangıç
  startSlowMotionResume(duration: 2.0);
  
  // 6. Continue kullanıldı işaretle
  player.continueUsed = true;
}
```

#### Görsel Feedback
- **Respawn Effect:** Mavi halka (pulse out)
- **Frozen Obstacles:** Gri renkle yarı-şeffaf
- **Resume Countdown:** 3...2...1...GO!
- **Screen Border:** 2 saniye yeşil glow (güvenli mod)

### 2.4 Limitler (Çok Önemli)
- **Her run için maksimum 1 continue**
- İkinci ölüm → direkt Game Over
- Continue butonu ikinci ölümde görünmez

#### Limit Logic
```javascript
// Run başlangıcı
player.continueUsed = false;

// Ölüm anında
if (player.continueUsed === false) {
  showContinueButton(); // Rewarded ad seçeneği
} else {
  showRestartOnly(); // Sadece restart
  // Interstitial ad gösterim şansı (her 2-3 restart)
}
```

### 2.5 Amaç
- Reklamın değerini artırmak
- Suistimali önlemek
- Oyuncuya "ikinci şans" hissi vermek
- ARPDAU'yu optimize etmek

---

## 3. INTERSTITIAL AD SİSTEMİ

### 3.1 Gösterim Kuralları
- **Frekans:** Her 2-3 oyunda (restart) 1 kez
- **Asla:** Oyun sırasında gösterilmez
- **Asla:** İlk restart'ta gösterilmez

### 3.2 En Uygun Zamanlar
1. **Restart Butonuna Basıldığında**
   - İkinci veya üçüncü restart
   - Ekran geçişinde (fade to black sırasında)

2. **Ana Menüye Dönüşte**
   - 3+ restart yapılmışsa
   - Exit butonu tıklandığında

### 3.3 Gösterim Logic
```javascript
let restartCount = 0;
const INTERSTITIAL_FREQUENCY = 3;

onRestartPressed() {
  restartCount++;
  
  if (restartCount % INTERSTITIAL_FREQUENCY === 0) {
    showInterstitialAd();
  }
  
  restartGame();
}

onHomePressed() {
  if (restartCount >= 3) {
    showInterstitialAd();
  }
  
  goToMainMenu();
}
```

### 3.4 Kullanıcı Deneyimi Koruması
- Loading screen ile seamless geçiş
- "Loading..." text + progress bar
- Max 5 saniye timeout (ad yüklenemezse skip)
- Kullanıcı kapatabilir (skip after 5s)

---

## 4. SKIN & TEMA UNLOCK MONETİZASYONU

### 4.1 Unlock Mantığı
- **Gerçek para ile satış yok** (MVP'de)
- **Reklam izleyerek açılır**
- Tema unlock'ları oyun içi başarıyla açılır (skor bazlı)

### 4.2 Tema Unlock (Automatic - Skor Bazlı)
| Tema | Unlock Skoru | Açıklama |
|------|--------------|----------|
| Grass & Sky | 0 | Varsayılan açık |
| Cloud World | 20 | İlk tema geçişi |
| Space | 50 | Orta zorluk milestone |
| Void | 100 | İleri seviye |
| Beyond Void | 150 | Elite oyuncu |

### 4.3 Skin Pack Unlock (Rewarded Ad)
MVP sonrası feature:

| Skin Pack | Reklam Sayısı | İçerik |
|-----------|---------------|---------|
| Neon Theme | 2 reklam | Neon renkli top + trail |
| Retro Theme | 2 reklam | Pixel art stil |
| Rainbow Theme | 3 reklam | Gökkuşağı renkleri |
| Galaxy Theme | 3 reklam | Galaksi desen |

### 4.4 Currency (Coins)
MVP aşamasında "Coins" para birimi eklenmiştir.
- **Kazanım:** Daily Login, Video İzleme (Opsiyonel)
- **Harcama:** Gelecek skin market güncellemesinde kullanılacak.

### 4.4 Unlock Flow
```
Main Menu → Themes → [Locked Theme]
       ↓
   "Unlock with Ad?"
       ↓
   Watch Rewarded Ad
       ↓
    Progress: 1/2
       ↓
   Watch Second Ad
       ↓
   THEME UNLOCKED! 🎉
```

---

## 5. RETENTION STRATEJİLERİ

### 5.1 Session Yapısı (İdeal Oyuncu Davranışı)

**Hedef Session:**
- **Süre:** 3-5 dakika
- **Run Sayısı:** 8-12 run
- **Ortalama Run:** 20-40 saniye
- **Rewarded Ad:** 2-3 izlenme
- **Interstitial:** 1 izlenme

**Session Flow Example:**
```
Oyuncu giriş (0:00)
  ↓
Run 1: 25s → Death → Continue (Ad 1) → 15s → Death
  ↓
Run 2: 30s → Death → Restart
  ↓
Run 3: 40s → Death → Continue (Ad 2) → 20s → Death
  ↓
Run 4: 35s → Death → Restart (Interstitial)
  ↓
Run 5-8: Devam...
  ↓
Exit (5:00 sonra)
```

**Monetization Breakdown:**
- Rewarded Ads: 2 (Run 1, Run 3)
- Interstitial: 1 (Run 4)
- Total Revenue:Run 5-8: Devam...
  ↓
Exit (5:00 sonra)
```

### 5.2 Daily Login Rewards (Retention Bouster)
Her gün oyuna giren kullanıcılar ödüllendirilir. 7 günlük bir döngü kullanılır.

**Döngü Yapısı:**
1. Gün: 50 Coins
2. Gün: 100 Coins
3. Gün: 150 Coins
4. Gün: 200 Coins
5. Gün: 250 Coins
6. Gün: 300 Coins
7. Gün: **Premium Skin / Büyük Ödül**

**Save System:**
- `last_login_date` kontrol edilir.
- Ardışık giriş ise `streak` artar.
- Kaçırılan gün olursa `streak` sıfırlanır.

### 5.3 Zorluk Eğrisi (Retention İçin Optimize)

| Süre | Oyun Davranışı | Amaç |
|------|----------------|------|
| 0–10 sn | Sadece renk eşleşmesi | Öğrenme, erken ölümü engelle |
| 10–30 sn | Renk + şekil | Core mechanic tanıtımı |
| 30–60 sn | Hız artışı, tema 2 | Progression hissi |
| 60+ sn | Tema 3-4, max zorluk | Elite oyuncu challenge |

**Retention Principle:**
> İlk 10 saniyede öldürme, 30 saniyede tutsak et, 60 saniyede hayran yap.

### 5.3 Tema Geçişleri (Progression Hooks)

**Tema = Görsel Milestone**
- İlk tema geçişi: ~30-40 saniye (Skor 20)
- Her tema görsel olarak belirgin farklı
- Tema geçişinde "THEME UNLOCKED" bildirimi

**Psikolojik Etki:**
```
Oyuncu düşüncesi:
"19 skor → Bir daha oynarsam bulutlara çıkacağım!"
"49 skor → Uzaya çok az kaldı, bir daha!"
"Uzaya çıktım! → Void'e ulaşabilir miyim?"
```

**Tema Geçiş Reward Loop:**
1. Oyuncu tema hedefine yaklaşır
2. Görsel değişim heyecanı
3. Ölüm → "Bir daha" motivasyonu
4. Rewarded ad ile devam (tema atlamamak için)
5. Tema unlock → Başarı hissi
6. Sonraki tema hedefi → Döngü devam

---

## 6. MİNİ HEDEF SİSTEMİ

**Büyük görev sistemi yok** (karmaşıklık önleme)

### HUD Hedef Göstergeleri
```
┌──────────────────────────┐
│  Score: 47               │ ← Ana skor (büyük)
│  Next Theme: 50 🌌       │ ← Mini hedef (küçük)
│  Best: 89 🏆             │ ← Kişisel rekor
└──────────────────────────┘
```

### Hedef Tipleri
1. **Next Theme:** Bir sonraki tema için kalan skor
2. **Best Score:** Kişisel rekor (beat etmek için motivasyon)
3. **Checkpoint:** Sonraki checkpoint'e kalan engel (opsiyonel)

**Örnek Gösterimler:**
- Skor 15 → "Next Theme: 20 ☁️"
- Skor 45 → "Next Theme: 50 🌌"
- Skor 88 → "Beat Best: 89 🏆"

---

## 7. KPI HEDEFLERİ

### Retention (Tutma)
| Metrik | Hedef | Gerçekçi Aralık |
|--------|-------|-----------------|
| D1 Retention | %35-40 | %30-45 |
| D7 Retention | %15-20 | %12-25 |
| D30 Retention | %5-8 | %3-10 |
| Average Session | 3–5 dk | 2.5-6 dk |

### Engagement (Etkileşim)
| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| Runs per Session | 8-12 | Ortalama deneme sayısı |
| Average Run Duration | 30-45 sn | Optimal reklam frekansı |
| Theme 2 Reach Rate | %40+ | Cloud World'e ulaşan % |
| Theme 3 Reach Rate | %15+ | Space'e ulaşan % |

### Monetization (Gelir)
| Metrik | Hedef | Formül |
|--------|-------|--------|
| Rewarded Ad/User/Day | 3-5 | Session başına 2-3 |
| Interstitial/User/Day | 1-2 | Her 3 restart'ta 1 |
| ARPDAU | $0.05-0.08 | eCPM bazlı tahmin |
| Ad Fill Rate | >95% | Reklam yüklenme başarısı |

### Retention vs Monetization Dengesi
```
Ideal Oran:
- %40 D1 Retention
- 4 Rewarded Ad/User/Day
= Sürdürülebilir büyüme

Kötü Senaryo:
- %25 D1 Retention
- 6 Rewarded Ad/User/Day (aşırı)
= Churn artışı
```

---

## 8. KAÇINILMASI GEREKENLER

### ❌ Yapılmaması Gerekenler
1. **Oyunun ortasında reklam**
   - Akışı bölme
   - Kullanıcı deneyimi zedeleme

2. **İlk ölümde interstitial**
   - Frustration yaratma
   - Rewarded ad'i önceliklendirme

3. **Zorunlu reklam hissi**
   - "Ad to play" modeli YOK
   - Her zaman skip opsiyonu

4. **Aşırı unlock / karmaşıklık**
   - MVP'de maksimum 5 tema
   - Basit UI

5. **Fake difficulty spike**
   - Reklam için zorlaştırma YASAK
   - Organik zorluk eğrisi

6. **Ad spam**
   - Max 6 ad/session (rewarded + interstitial)
   - Kullanıcı rahatsız etme

---

## 9. A/B TEST PLANI (Post-Launch)

### Test 1: Interstitial Frequency
- **Grup A:** Her 2 restart'ta 1 (agresif)
- **Grup B:** Her 3 restart'ta 1 (pasif)
- **Metrik:** D1 Retention vs ARPDAU

### Test 2: Continue Respawn Pozisyonu
- **Grup A:** Aynı yerde respawn (mevcut)
- **Grup B:** 2 engel aşağıda respawn (kolay)
- **Metrik:** Rewarded ad completion rate

### Test 3: Tema Unlock Skorları
- **Grup A:** 20, 50, 100 (mevcut)
- **Grup B:** 15, 40, 80 (kolay)
- **Metrik:** Theme reach rate, session duration

### Test 4: Rewarded Ad CTA
- **Grup A:** "Continue" (nötr)
- **Grup B:** "Don't Give Up!" (emosyonel)
- **Metrik:** Rewarded ad watch rate

---

## 10. GELİR TAHMİNİ (Optimistik Senaryo)

### Varsayımlar
- **DAU:** 10,000 (ayda 3. ay)
- **Rewarded eCPM:** $15
- **Interstitial eCPM:** $8
- **Rewarded/User/Day:** 4
- **Interstitial/User/Day:** 1.5

### Hesaplama
```
Rewarded Revenue:
10,000 DAU × 4 ad × ($15 / 1000) = $600/day

Interstitial Revenue:
10,000 DAU × 1.5 ad × ($8 / 1000) = $120/day

Total Daily Revenue: $720
Monthly Revenue (30 days): $21,600
```

### Gerçekçi Senaryo (Konservatif)
```
DAU: 5,000
Rewarded/User/Day: 3
eCPM: $12 (lower tier geos)

Monthly Revenue: ~$6,000-8,000
```

---

## 11. ÖZET

### Temel Prensip
> **Oyuncu oyunu bırakmak üzereyken reklam izlemeli, reklam oyunu bölmemelidir.**

### Başarı Formülü
```
Kısa Runlar (20-40s)
    ↓
Sık Ölümler (doğal)
    ↓
Rewarded Ad (değerli)
    ↓
Devam Motivasyonu
    ↓
Tema Progression
    ↓
Retention Artışı
    ↓
Sürdürülebilir Gelir
```

### Stratejinin Gücü
Bu strateji şunları sağlar:
1. **Uzun vadeli retention** (tema progression)
2. **Stabil reklam geliri** (organik akış)
3. **Düşük uninstall oranı** (oyun bölünmemesi)
4. **Yüksek LTV** (loyal user base)

### Son Tavsiye
> Reklamı oyunun doğal bir parçası yap, engel değil.

---

## 12. IMPLEMENTATION CHECKLİST

### Rewarded Ad Sistemi
- [ ] AdMob / Unity Ads SDK entegrasyonu
- [ ] Continue mekanizması (respawn + freeze)
- [ ] 1 continue/run limiti
- [ ] Ad loading fallback (network error)
- [ ] Completion rate tracking

### Interstitial Ad Sistemi
- [ ] 2-3 restart frekansı logic
- [ ] Timing optimization (ekran geçişi)
- [ ] Skip after 5s timeout
- [ ] Impression tracking

### Analytics Integration
- [ ] Session tracking
- [ ] Death reason logging
- [ ] Ad event tracking
- [ ] Theme progression tracking
- [ ] ARPDAU hesaplama

### A/B Testing Setup
- [ ] Remote config (Firebase)
- [ ] Variant assignment
- [ ] Metrik toplama
- [ ] Dashboard setup

---

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅  
**Target ARPDAU:** $0.05-0.08  
**Target D1 Retention:** %35-40
